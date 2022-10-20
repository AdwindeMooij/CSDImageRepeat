# ImageRepeat Script For Adobe InDesign
## Purpose
This script enables you to easily place and repeat one or more images into a single file.  
For each image file a new page (or set of pages if the number of copies that fit a single page is greater than the copies per image needed) is created.  

## Important notes
This is my first attemt at scripting for InDesign, while having limited time, and a limited background in Javascript.  
Therefore, this script may have some bugs or miss some essential features, resulting in unexpected behaviour.  
Always make sure you apply this script on a __new__ document, and/or save all documents you have currently open in InDesign to prevent losing your current documents.  
  
Found a bug, or miss a feature?  
Please let me know if the script doesn't work as expected, or if you need an extra feature in this script, by opening an issue.  

## How does the script work?

### Select image(s)
Once you select the script, a dialog with your system's file browser will open.  
You can select one or more files as input for the script.  
The script is meant to work using .JPEG, .JPG, .PNG, and/or .PSD file extensions.  

_Up to version 1.0.1 a file extension filter is not yet implemented._  
_Selecting other file extensions may result in unexpected behaviour._  

### Set image dimensions
After selecting the required files, a dialog appears in which you can adjust some parameters for the script.  
The first adjustable parameters are __Image Width__ and __Image Height__.  
Measurement units in the input fields are based upon the measurement unit selected in the current document.  

### Set Image Bleed
__Image Bleed__ 

### Total Copies Per Image
Based on the values set in __Image Width__ and __Image Height__, combined with the page width and page height of the current document, te script will calculate how much images can fit a single page.  
Each page will be filled with the number of images that fit a single page.  
You can input a number of copies you need, and the script will calculate how many pages it needs to __at least__ have the amount of copies per image.  
Since the script fills each page with the maximum amount of images that fit a page, this may result in more copies than set in __Total Copies Per Image__.  

_For example:  
You have selected 1 image and set a width and height.  
In the __Total Copies Per Image__ field you have set the value to 5.  
The script caculated that, based on your image and page dimensions, a single image can fit 4 images.  
Therefore, the script will create 2 pages with 4 images each, resulting in a total of 8 copies._  

### Image Frame Filling
The script will use this option to set interpret how the image must be placed in the image frame.  
  
__Options__  
1. Center Content  
__Center Content__ will place the image in the center of the image frame while not changing the dimensions of original image.  
  
2. Content To Frame  
__Content To Frame__ will adjust the dimensions of your image file to the dimensions of the frame.  
Using this option may result in compressed or strechted images.  
  
3. Fill Proportionally (Default)  
__Fill Proportionally__ will adjust the scale of your image proportionally to fill the image frame.  
This option may result cause the edges of your image to fall outside the image frame and become unvisible.  

4. Proprotionally  
__Proportionally__ will adjust the scale of your image proportionally to fit within the image frame.  
While this option makes sure your entire image is within the image frame, it may result in extra whitespaces if the width:height ratio of your image does not equal the width:height ratio of the image frame.  

### Cropmarks Options
The script will automatically place cropmarks around each image.  
The appearance of the cropmarks can be changed based on 3 inputs, __Length__, __Offset__, and __Stroke Weight__.  
  
1. Length  
Sets the __Length__ of the cropmarks in POINTS (Default: 8 pt).  

2. Offset  
Sets the __Offset__ of the cropmarks relative to the image corner edges in POINTS (Default 5 pt).  

3. Stroke Weight  
Sets the __Stroke Weight__ of the cropmarks in POINTS (Default: 0,25 pt).  

## Versioning
To make a proper distincion between version numbers, the following version logic is used:  
X.0.0 is a major release with new features added.  
0.X.0 is a minor release with bugfixes.  
0.0.X is a minor release with variable changes.  
