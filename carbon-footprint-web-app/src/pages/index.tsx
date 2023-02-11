import React from "react";
import {Container, Grid, IconButton, Tooltip, Typography} from "@mui/material";
import {UsageReportDTO} from "../dto/Usage/UsageReport";
import axios from "axios";
import InfoIcon from '@mui/icons-material/Info';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function Home({usage}: { usage: UsageReportDTO[] }) {
    const [sortColumn, setSortColumn] = React.useState<"website_usage_factor" | "website_total_usage">("website_usage_factor");
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
    return <Container>
        {
            <Grid container={true} spacing={0}>
                <Grid item={true} container={true} spacing={0} xs={12} sx={{
                    backgroundColor: "#dddddd",
                    paddingLeft: "30px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}>
                    <Grid item={true} xs={4}>
                        <Typography>Website Origin</Typography>
                    </Grid>
                    <Grid item={true} xs={4} sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}>
                        <IconButton onClick={()=>{
                            if(sortColumn === "website_total_usage"){
                                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                            } else {
                                setSortColumn("website_total_usage");
                                setSortDirection("desc");
                            }
                        }}>
                            <SwapVertIcon/>
                        </IconButton>
                        <Typography>Website Usage </Typography>
                    </Grid>
                    <Grid item={true} xs={4} sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}>
                        <IconButton onClick={()=>{
                            if(sortColumn === "website_usage_factor"){
                                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                            } else {
                                setSortColumn("website_usage_factor");
                                setSortDirection("desc");
                            }
                        }}>
                            <SwapVertIcon/>
                        </IconButton>
                        <Typography>Usage Factor</Typography>
                        <Tooltip title={
                            "The usage factor is the amount of carbon dioxide emitted adjusted with how much the website is being used"
                        } sx={{
                            cursor: "pointer",
                            marginLeft: "5px"
                        }}>
                            <InfoIcon scale={"small"}/>
                        </Tooltip>
                    </Grid>
                </Grid>
                {
                    usage.map((u: UsageReportDTO) => {
                        return {
                            website_origin: u.website_origin,
                            website_total_usage: u.website_total_usage * 1000,
                            website_usage_factor: (u.website_total_usage * (1000 * 1000) / u.website_report_count).toFixed(4)
                        }
                    })
                        .sort((a: any, b: any) => {
                            return (b[sortColumn] - a[sortColumn])* (sortDirection === "asc" ? -1 : 1);
                        })
                        .map((u: any, index) => {
                            return <Grid
                                key={u.website_origin}
                                item={true} container={true}
                                spacing={0} xs={12}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f5f5",
                                    height: "60px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingLeft: "30px",
                                }}
                            >
                                <Grid item={true} xs={4}>
                                    <Typography>
                                        {u.website_origin.length > 35 ? u.website_origin.substring(0, 30) + "..." : u.website_origin}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={4} sx={{
                                    paddingLeft: "30px"
                                }}>
                                    <Typography>{u.website_total_usage.toFixed(2)} gm eq. CO<sub>2</sub></Typography>
                                </Grid>
                                <Grid item={true} xs={4} sx={{
                                    paddingLeft: "30px"
                                }}>
                                    <Typography>{u.website_usage_factor}</Typography>
                                </Grid>
                            </Grid>
                        })
                }
            </Grid>
        }
    </Container>
}

Home.getInitialProps = async () => {
    const res = await axios.get(`https://sudip-mondal-2002-ideal-zebra-7x9r4gj6xrqcrx9q-3000.preview.app.github.dev/api/usage`);
    const usage = await res.data;
    return {usage};
}