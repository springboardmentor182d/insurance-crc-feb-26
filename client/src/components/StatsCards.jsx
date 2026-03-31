import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import FlagIcon from "@mui/icons-material/Flag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const cardStyle = {
  padding: 20,
  borderRadius: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={3}>
        <Paper sx={cardStyle}>
          <div>
            <Typography variant="body2">Total Flags</Typography>
            <Typography variant="h5">{stats.total_flags}</Typography>
          </div>
          <ShieldIcon sx={{ color: "#8b5cf6" }} />
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper sx={cardStyle}>
          <div>
            <Typography variant="body2">High Severity</Typography>
            <Typography variant="h5">{stats.high_severity}</Typography>
          </div>
          <WarningIcon sx={{ color: "#ef4444" }} />
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper sx={cardStyle}>
          <div>
            <Typography variant="body2">New Cases</Typography>
            <Typography variant="h5">{stats.new_cases}</Typography>
          </div>
          <FlagIcon sx={{ color: "#3b82f6" }} />
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper sx={cardStyle}>
          <div>
            <Typography variant="body2">Escalated</Typography>
            <Typography variant="h5">{stats.escalated}</Typography>
          </div>
          <TrendingUpIcon sx={{ color: "#8b5cf6" }} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default StatsCards;