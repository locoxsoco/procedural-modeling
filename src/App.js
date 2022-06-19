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
import { OrbitControls, Center } from "@react-three/drei";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { saveAs } from "file-saver";

const mdTheme = createTheme();
let scene, list_model_objects;
let i = 0;

class ModelObject {
  constructor(
    model_type,
    traslation_x,traslation_y,traslation_z,
    scale_x,scale_y,scale_z,
    rotation_x,rotation_y,rotation_z
  ) {
    this.model_type = model_type;
    this.traslation_x = traslation_x;
    this.traslation_y = traslation_y;
    this.traslation_z = traslation_z;
    this.scale_x = scale_x;
    this.scale_y = scale_y;
    this.scale_z = scale_z;
    this.rotation_x = rotation_x;
    this.rotation_y = rotation_y;
    this.rotation_z = rotation_z;
    //console.log('Objeto creado:',model_type)
  }
}

export function App() {
  const [value, setValue] = useState("T(0,0,0) S(1,2,1) I('cube')");
  const [shapesOnCanvas,setShapesOnCanvas] = useState([]);

  function Shape(props) {
    scene = useThree(state => state.scene);
    //console.log(props.shape);

    const allShapes= {
      cube: new THREE.BoxGeometry( 1, 1, 1 ),
      cylinder: new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 ),
      sphere : new THREE.SphereGeometry( 0.5, 32, 16 ),
      cone : new THREE.ConeGeometry( 0.5, 1, 32 ),
      pyramid : new THREE.ConeGeometry( 0.7071067811865475, 1, 4 )
    }

    let position_x = props.shape.traslation_x + props.shape.scale_x/2.0;
    let position_y = props.shape.traslation_y + props.shape.scale_y/2.0;
    let position_z = props.shape.traslation_z + props.shape.scale_z/2.0;

    let rotation_y = props.shape.model_type == 'pyramid' ? (props.shape.rotation_y+90)*3.14159192/360 : props.shape.rotation_y*3.14159192/360; 
  
    return (
      <mesh 
        {...props}
        position={[position_x,position_y,position_z]}
        rotation={[props.shape.rotation_x*3.14159192/360,rotation_y,props.shape.rotation_z*3.14159192/360]}
        scale={[props.shape.scale_x,props.shape.scale_y,props.shape.scale_z]}
      >
        <primitive object={allShapes[props.shape.model_type]} attach={"geometry"} />
        <meshNormalMaterial attach="material" />
      </mesh>
    );
  }

  function downloadFile() {
    const exporter = new PLYExporter();
    exporter.parse(scene, function (plyJson) {
      //console.log(plyJson);
      //const jsonString = JSON.stringify(plyJson);
      //console.log(jsonString);
      const blob = new Blob([plyJson], { type: "application/json" });
      saveAs(blob, "cga-model.ply");
      //console.log("Download requested");
    }, { binary: false });
  }

  function generateMesh() {
    setShapesOnCanvas([]);
    let aux_list = [];
    for(const model_object of list_model_objects){
      console.log(model_object);
      aux_list.push(<Shape 
        shape={model_object}
        key={i}
        />);
      setShapesOnCanvas(
        aux_list
      );
      i = i+1;
    }
  }

  function processCGAScript(){
    let script = value.replace(/\s+/g,'');
    let cur_index = script.lastIndexOf('(');
    let cur_model_type,
    cur_traslation_x,
    cur_traslation_y,
    cur_traslation_z,
    cur_scale_x,
    cur_scale_y,
    cur_scale_z,
    cur_rotation_x,
    cur_rotation_y,
    cur_rotation_z;
    if(cur_index == -1 || script[cur_index-1] != 'I'){
      alert('Could not process the syntax. Last letter is not I. Please try again.');
      return;
    }
    cur_model_type = null;
    cur_traslation_x = 0;
    cur_traslation_y = 0;
    cur_traslation_z = 0;
    cur_scale_x = 1;
    cur_scale_y = 1;
    cur_scale_z = 1;
    cur_rotation_x = 0;
    cur_rotation_y = 0;
    cur_rotation_z = 0;
    list_model_objects = [];
    while(script != ''){
      cur_index = script.lastIndexOf('(');
      if(script[cur_index-1] == 'I'){
        if(cur_model_type != null){
          list_model_objects.push(new ModelObject(
            cur_model_type,
            cur_traslation_x,
            cur_traslation_y,
            cur_traslation_z,
            cur_scale_x,
            cur_scale_y,
            cur_scale_z,
            cur_rotation_x,
            cur_rotation_y,
            cur_rotation_z
          ));
          cur_model_type = null;
          cur_traslation_x = 0;
          cur_traslation_y = 0;
          cur_traslation_z = 0;
          cur_scale_x = 1;
          cur_scale_y = 1;
          cur_scale_z = 1;
          cur_rotation_x = 0;
          cur_rotation_y = 0;
          cur_rotation_z = 0;
        }
        cur_model_type = script.slice(cur_index+2,script.length-2);
        if(cur_model_type == 'cube' || cur_model_type == 'cylinder' || cur_model_type == 'sphere' || cur_model_type == 'cone' || cur_model_type == 'pyramid'){
          //console.log('Model type:',cur_model_type);
          script = script.slice(0,cur_index);
        } else {
          alert('Could not process the syntax. Model type not recognized. Please try again.');
          return;
        }
        
      } else if(script[cur_index-1] == 'T'){
        let traslation_script = script.slice(cur_index+1,script.length-1);
        const my_array = traslation_script.split(",");
        cur_traslation_x = parseFloat(my_array[0]);
        cur_traslation_y = parseFloat(my_array[1]);
        cur_traslation_z = parseFloat(my_array[2]);
        //console.log('Traslation xyz:',cur_traslation_x,cur_traslation_y,cur_traslation_z);
        script = script.slice(0,cur_index);
      } else if(script[cur_index-1] == 'S'){
        let scale_script = script.slice(cur_index+1,script.length-1);
        const my_array = scale_script.split(",");
        cur_scale_x = parseFloat(my_array[0]);
        cur_scale_y = parseFloat(my_array[1]);
        cur_scale_z = parseFloat(my_array[2]);
        //console.log('Scale xyz:',cur_scale_x,cur_scale_y,cur_scale_z);
        script = script.slice(0,cur_index);
      } else if(script[cur_index-1] == 'R'){
        let rotation_script = script.slice(cur_index+1,script.length-1);
        const my_array = rotation_script.split(",");
        cur_rotation_x = parseFloat(my_array[0]);
        cur_rotation_y = parseFloat(my_array[1]);
        cur_rotation_z = parseFloat(my_array[2]);
        //console.log('Rotation xyz:',cur_rotation_x,cur_rotation_y,cur_rotation_z);
        script = script.slice(0,cur_index);
      } else {
        alert('Could not process the syntax. Letter not recognized. Please try again.');
        return;
      }
      script = script.slice(0,script.length-1);
      //console.log(script);
      if(cur_index == -1){
        alert('Could not process the syntax. Please try again.');
        return;
      }
    }
    if(script == ''){
      list_model_objects.push(new ModelObject(
        cur_model_type,
        cur_traslation_x,
        cur_traslation_y,
        cur_traslation_z,
        cur_scale_x,
        cur_scale_y,
        cur_scale_z,
        cur_rotation_x,
        cur_rotation_y,
        cur_rotation_z
      ));
    }
    generateMesh();
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
              placeholder="Ex: T(0,0,0) S(1,2,1) I('cube')"
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
            <Center>
            <OrbitControls /*enableZoom={false}*/ />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-2, 5, 2]} />
            <Suspense fallback={null}>
              {[...shapesOnCanvas]}
              <primitive object={new THREE.AxesHelper(10)} />
            </Suspense>
            </Center>
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
                  <span>Square Pyramid: I('pyramid')</span>
                </Stack>
              </Typography>                
              <Typography component="h5" paragraph>
                The geometric operations are:
                <Stack spacing={0}>
                  <span>Traslation: T(0,0,2)</span>
                  <span>Rotation: R(0,90,0)</span>
                  <span>Scale: S(1,2,1)</span>
                </Stack>
              </Typography>
              <Typography component="h5" >
                Example 1 (The one shown in the slides):
              </Typography>
              <Typography component="h5" variant="h10" spacing={0} paragraph>
                <span>T(3,6,8) S(4,4,4) I('sphere')T(3,0,8) S(4,8,4) I('cylinder')T(3,0,0) S(3.5,6.5,9) I('cube')T(0,0,3) S(4,5,9) I('cube')</span>
              </Typography>
              <Typography component="h5">
                Example 2 (A barn):
              </Typography>
              <Typography component="h5" variant="h10" spacing={0} paragraph>
                <span>T(0,1,2) S(2,1,2) I('cone')T(0,0,2) S(2,1,2) I('cylinder')T(6,1,2) S(2,1,2) I('cone')T(6,0,2) S(2,1,2) I('cylinder')T(3,-2,0)R(0,0,180) S(2,8,2) I('cylinder')T(0,0,0) S(8,2,2) I('cube')</span>
              </Typography>
              <Typography component="h5">
                Example 3 (A Quidditch field):
              </Typography>
              <Typography component="h5" variant="h10" spacing={0} paragraph>
                <span>T(8,0,2) S(2,1,10) I('cube')T(8,6,12) S(2,2,2) I('pyramid')T(8,0,12) S(2,6,2) I('cube') T(2,0,12) S(6,1,2) I('cube')T(0,6,12) S(2,2,2) I('pyramid')T(0,0,12) S(2,6,2) I('cube') T(0,0,2) S(2,1,10) I('cube')T(0,6,0) S(2,2,2) I('pyramid')T(0,0,0) S(2,6,2) I('cube') T(2,0,0) S(6,1,2) I('cube') T(8,6,0) S(2,2,2) I('pyramid')T(8,0,0) S(2,6,2) I('cube')</span>
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
