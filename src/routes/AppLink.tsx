// 应用快捷链接
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile, create, writeFile, exists, BaseDirectory } from "@tauri-apps/plugin-fs";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// https://fonts.google.com/icons?icon.set=Material+Icons
import { QueuePlayNext } from "@mui/icons-material";

interface BaseLink {
  name: string;
  order?: number;
}
interface AppLink extends BaseLink {
  icon: string;
  filepath?: string;
}
function AppLink() {
  const [appLinkList, setAppLinkList] = useState<AppLink[]>([]);

  useEffect(() => {
    // setAppLinkList([
    //   { name: "vscode", icon: "https://code.visualstudio.com/favicon.ico", filepath: "D:\\devtools\\Microsoft VS Code\\Code.exe" },
    //   { name: "postman", icon: "https://www.postman.com/_ar-assets/images/favicon-1-48.png", filepath: "C:\\Users\\eminoda\\AppData\\Local\\Postman\\Postman.exe" },
    //   { name: "企业微信", icon: "//wwcdn.weixin.qq.com/node/wwnl/wwnl/style/images/independent/favicon/favicon_48h$c976bd14.png" },
    // ]);
    loadAppLinkFileData();
  }, []);

  const mkirpAppLinkFile = async () => {
    // 查询文件是否存在
    const fileExist = await exists("appLinkFile.json", { baseDir: BaseDirectory.AppLocalData });
    if (!fileExist) {
      // 创建文件
      await create("appLinkFile.json", { baseDir: BaseDirectory.AppLocalData });
    }
  };

  const loadAppLinkFileData = async () => {
    await mkirpAppLinkFile();
    const fileData = await readTextFile("appLinkFile.json", { baseDir: BaseDirectory.AppLocalData });
    const appLinkData = fileData ? JSON.parse(fileData) : [];
    setAppLinkList(appLinkData);
  };

  const updateAppLinkData = async (appLink: AppLink) => {
    setAppLinkList([...appLinkList, appLink]);
    // 更新数据
    let encoder = new TextEncoder();
    await writeFile("appLinkFile.json", encoder.encode(JSON.stringify([...appLinkList, appLink], null, 4)), { baseDir: BaseDirectory.AppLocalData });
    console.log(JSON.stringify(appLinkList));
  };

  // 新增appLink
  const handleAddApp = async () => {
    try {
      const filepath = await open({
        multiple: false,
        title: "请选择应用程序",
        directory: false,
        canCreateDirectories: false,
        // defaultPath: "C:\\Users",
        filters: [
          {
            name: "AppChoose",
            extensions: ["exe"],
          },
        ],
      });
      if (filepath) {
        await updateAppLinkData({
          name: "Hello",
          icon: "https://code.visualstudio.com/favicon.ico",
          filepath,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppLink = (data: AppLink) => {
    console.log(data.filepath);
    invoke("open_app_link", { url: data.filepath }).then((data) => {
      console.log(data);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <Stack direction="row" spacing={0} useFlexGap sx={{ flexWrap: "wrap" }}>
        {appLinkList.map((item, index) => {
          return (
            <Button key={index} sx={{ width: 100 }} onClick={() => handleAppLink(item)}>
              <Stack direction="column" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", textTransform: "none" }}>
                <Avatar alt="Remy Sharp" src={item.icon} variant="rounded" />
                <Typography>{item.name}</Typography>
              </Stack>
            </Button>
          );
        })}
        <Button sx={{ width: 100 }} onClick={() => handleAddApp()} color="secondary">
          <Stack direction="column" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center", textTransform: "none" }}>
            <QueuePlayNext sx={{ fontSize: 40 }} color="secondary" />
            <Typography>添加应用</Typography>
          </Stack>
        </Button>
      </Stack>
    </Container>
  );
}
export default AppLink;
