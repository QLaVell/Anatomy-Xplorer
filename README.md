# TechNOVR's Anatomy Xplorer

## Overview

The Anatomy Xplorer is an augmented reality (AR) application that lets students visualize and learn about 3D human organs. Each organ has a properly textured 3D model that can be rotated to view at any angle as well as a text description of the organ itself. The 3D models are triggered to appear upon scanning one of the included AR markers. The models can then be rotated using a tap and drag motion. Rotate the button on the model to show the description text to learn more about the organ. When you're ready to move on to the next model, scan a new AR marker or click "Clear entities" to remove all 3D models from the screen. If you're interested in learning what each organ is called in other languages, head to the home screen using the "Exit" button and select your desired language from the dropdown menu (note: Only the names of organs are translated. The descriptions remain in English only.)  
The current organs supported are:  
* Heart
* Brain
* Liver
* Lungs

The current languages supported are:
* English
* Hindi
* Japanese (romanized)
* Telugu

## Inputs

Each 3D model organ is associated with an AR marker. The AR markers can be found in the AR_Markers folder. Upon scanning an AR marker with the application, the associated 3D model will appear.

## Outputs

When an AR marker is scanned, its associated 3D model will appear. Each 3D model has at least one button on its surface (the model may need to be rotated to bring the button into view). Upon clicking the button, a text description of the organ will be displayed.
