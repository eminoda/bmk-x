// 应用快捷链接

import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function AppLink() {
  return (
    <div>
      <div>
        <Card sx={{ border: 1, width: 200 }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
              123
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>adjective</Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <Button variant="contained">Hello world</Button>
      </div>
    </div>
  );
}
export default AppLink;
