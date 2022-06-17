import React, {Suspense, useState } from "react";
import './App.css';
import * as THREE from "three";
import { PLYExporter } from "three/examples/jsm/exporters/PLYExporter";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { saveAs } from "file-saver";

const mdTheme = createTheme();
let scene;

export function App() {
  const [value, setValue] = useState("T(0,0,6) S(8,10,18) I('cube')");

  function CGA() {
    scene = useThree(state => state.scene);  
    //const colorMap = useLoader(TextureLoader, texture);
  
    return (
      <mesh rotation={[90, 0, 20]}>
        <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
        <meshNormalMaterial attach="material" />
        {/* <meshStandardMaterial map={colorMap} /> */}
      </mesh>
    );
  }

  function downloadFile() {
    const exporter = new PLYExporter();
    exporter.parse(scene, function (plyJson) {
      //console.log(plyJson);
      /*const jsonString = JSON.stringify(plyJson);
      console.log(jsonString);*/
      const blob = new Blob([plyJson], { type: "application/json" });
      saveAs(blob, "cga-model.ply");
      //console.log("Download requested");
    }, { binary: false });
  }

  function processCGAScript(){
    console.log(value);
  };

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
              label="Write CGA rules"
              placeholder="Ex: T(0,0,6) S(8,10,18) I('cube')"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button 
              variant="contained"
              onClick={processCGAScript}
            >
              Run!
            </Button>
          </Grid>
          <Grid item xs={9}>
          <Canvas className="canvas">
            <OrbitControls /*enableZoom={false}*/ />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-2, 5, 2]} />
            <Suspense fallback={null}>
              <CGA/>
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
              <Typography component="h2" variant="h5" paragraph>
                CGA Syntax
              </Typography>
              <Typography component="h5" paragraph>
                The objects to be instanced are:
                <Stack spacing={0}>
                  <span>Cube: I('cube')</span>
                  <span>Sphere: I('sphere')</span>
                  <span>Cylinder: I('cylinder')</span>
                </Stack>
              </Typography>                
              <Typography component="h5" paragraph>
                The geometric operations are:
                <Stack spacing={0}>
                  <span>Traslation: T(0,0,6)</span>
                  <span>Rotation: R(90,0,20)</span>
                  <span>Scale: S(8,10,18)</span>
                </Stack>
              </Typography>
              <Button
                variant="contained"
                onClick={downloadFile}
              >
                Export
              </Button>
            </Paper>              
          </Grid>
        </Grid>
      </Container>
    </Box>
  </ThemeProvider>
  );
  
}

export default App;
