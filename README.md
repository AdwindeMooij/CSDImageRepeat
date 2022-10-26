# ImageRepeat Script For Adobe InDesign

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/AdwindeMooij/CSDImageRepeat?color=green&display_name=tag&style=for-the-badge)](https://github.com/AdwindeMooij/CSDImageRepeat/releases/latest)

## Purpose
This script enables you to easily place and repeat one or more images into a single file.  
For each image file a new page (or set of pages if the number of copies that fit a single page is greater than the copies per image needed) is created.  

## Important notes
This is my first attemt at scripting for InDesign, while having limited time, and a limited background in Javascript. Therefore, this script may have some bugs or miss some essential features, resulting in unexpected behaviour. Always make sure you apply this script on a __new__ document, and/or save all documents you have currently open in InDesign to prevent losing your current documents.  
  
Found a bug, or miss a feature?  
Please let me know if the script doesn't work as expected, or if you need an extra feature in this script, by opening an issue.  

## How does the script work?

### Select image(s)
Once you select the script, a dialog with your system's file browser will open.  
You can select one or more files as input for the script.  
The script is meant to work using .JPEG, .JPG, .PNG, and/or .PSD file extensions [^1].  

### Set image dimensions
After selecting the required files, a dialog appears in which you can adjust some parameters for the script.  
The first adjustable parameters are `Image Width` and `Image Height`.  
Measurement units in the input fields are based upon the measurement unit selected in the current document.  

### Set Image Bleed
`Image Bleed` will set an user defined image bleed around each image.  
The script will check if the bleed does not exceed the cropmarks.  
If it does, the script will display an alert `Cropmarks are too small or bleed too large. Try again.`

### Total Copies Per Image
Based on the values set in `Image Width` and `Image Height`, combined with the page width and page height of the current document, te script will calculate how much images can fit a single page.  
Each page will be filled with the number of images that fit a single page.  
You can input a number of copies you need, and the script will calculate how many pages it needs to __at least__ have the amount of copies per image.  
Since the script fills each page with the maximum amount of images that fit a page, this may result in more copies than set in `Total Copies Per Image`.  

_For example:  
You have selected 1 image and set a width and height.  
In the `Total Copies Per Image` field you have set the value to 5.  
The script caculated that, based on your image and page dimensions, a single image can fit 4 images.  
Therefore, the script will create 2 pages with 4 images each, resulting in a total of 8 copies._  

### Image Frame Filling
The script will use this option to set interpret how the image must be placed in the image frame.   
  
#### Options: 
1. Center Content  
`Center Content` will place the image in the center of the image frame while not changing the dimensions of original image.  
  
2. Content To Frame  
`Content To Frame` will adjust the dimensions of your image file to the dimensions of the frame.  
Using this option may result in compressed or strechted images.  
  
3. Fill Proportionally (Default)  
`Fill Proportionally` will adjust the scale of your image proportionally to fill the image frame.  
This option may result cause the edges of your image to fall outside the image frame and become unvisible.  

4. Proprotionally  
`Proportionally` will adjust the scale of your image proportionally to fit within the image frame.  
While this option makes sure your entire image is within the image frame, it may result in extra whitespaces if the width:height ratio of your image does not equal the width:height ratio of the image frame.  

### Optimize Page Oriention
As of version 2.0.0, the `Optimize Page Orientation` checkbox enables you to let the script calculate the page orientation that fits the most images on a single page.  
Unchecking this option will keep the orientation of the current document.  

### Cropmarks Options
The script will automatically place cropmarks around each image.  
The appearance of the cropmarks can be changed based on 3 inputs, `Length`, `Offset`, and `Stroke Weight`.  
  
1. Length  
Sets the `Length` of the cropmarks in POINTS (Default: 8 pt).  

2. Offset  
Sets the `Offset` of the cropmarks relative to the image corner edges in POINTS (Default 5 pt).  

3. Stroke Weight  
Sets the `Stroke Weight` of the cropmarks in POINTS (Default: 0,25 pt).  

## Versions
Versions are based on [Sementic Versioning](https://semver.org/).
  
  
[^1]: Up to version 2.0.0 a file extension filter is not yet implemented.
  Selecting other file extensions may result in unexpected behaviour.
