import React, {Suspense, Component } from "react";
import './App.css';
import * as THREE from "three";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Canvas} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BoxMesh from "./components/BoxMesh";

let scene, camera, renderer, cube;
const mdTheme = createTheme();

class App extends Component {

  render() {
    return (
    <ThemeProvider theme={mdTheme}>
      <Box component="main"
          sx={{
            backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            display: 'flex'
          }}>
        <CssBaseline />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <TextField
                id="outlined-textarea"
                label="Multiline Placeholder"
                placeholder="Placeholder"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained">Run!</Button>
            </Grid>
            <Grid item xs={9}>
            <Canvas className="canvas">
              <OrbitControls /*enableZoom={false}*/ />
              <ambientLight intensity={0.5} />
              <directionalLight position={[-2, 5, 2]} />
              <Suspense fallback={null}>
                <BoxMesh />
              </Suspense>
            </Canvas>
            </Grid>
            <Grid item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div>Deposits</div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
    );
  }
}

export default App;
