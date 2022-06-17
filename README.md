# Simple Procedural Modeling

## About

This project deploys a Simple Procedural Modeling syntax on the web. This syntax has 4 operations:

- Instanciate an object with *I('model_type')*
- Traslate object with *T(tx,ty,tz)*
- Rotate object with *R(rx,ry,rz)*
- Scale object with *T(sx,sy,sz)*

As for the available objects to be used, these are:
 - Cubes: *'cube'*
 - Cyliders: *'cylinder'*
 - Spheres: *'sphere'*
 - Cones: *'cone'*

Currently, the geometric operations are independent between each other and is only applied to the right adjacent object declared. For example:

*R(0,0,0)I('cube')T(2,0,0)I('sphere')*

In this example, the Rotation operation will only be applied to the cube and the Traslation operation to the sphere. The rotation is in domain [0,2*pi]. As for the operations not explicity declared for an object, the default parameters are as follows:

- Traslation: T(0,0,0)
- Rotation: T(0,0,0)
- Scale: T(1,1,1)

Once the syntax is correctly declared in the input text, pressing RUN! will generate the model. By pressing the EXPORT button, the generated model will be downloaded as a .ply file.

## Stack

- ReactJS
- ThreeJS
- ThreeJS Fiber
- Material UI

## Test on web

You can try the project through the following link:

http://procedural-modeling.s3-website.eu-west-3.amazonaws.com/

## Run locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

