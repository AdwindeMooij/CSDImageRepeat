// CSDImageRepeat.jsx
// Script to select multiple files, set number of copies needed and divide every image copy set over a seperate page.
//
// Author: Adwin de Mooij
//
// Change Log:
// Version: 2.0.0 | 26-10-2022
// Added: optimizeOrientation function which changes the page orientation to fit the most images on a single page.
// Added: dialog checkbox for users to choose if they want the script to calculate and set the optimized orientation or to keep using the current page orientation.
// 
// Change: convertValueToDocumentMeasurementUnits function to use a switch-statement instead of an if-statement for improved readability.
// Change: README to include description of optimizeOrientation option.
// Change: README to include correct versioning system.
//
// Version: 1.0.0 | 26-10-2022
// First release.
//
// #target "InDesign"

main();

function main() {
    var files = selectFiles();

    if(files === null) {
        alert("No files selected. Please try again.");
        exit();
    }

    createDialog(files);	
}

// Open the file browser.
// Currently only tested with MacOS.
function selectFiles() {
    // TODO: check for correct file extensions.
    // TODO: make filter for allow file extensions in openDialog box.
    var allowedExtensions = [".jpg", ".jpeg", ".png"];   

    var myImages = File.openDialog("Select images", "", true);

    return myImages;
}

function createDialog(myImages){
    var myDialog = app.dialogs.add({name:"Image importer", canCancel:true});
    var myDocument = app.activeDocument;
    var totalSelectedImages = myImages.length;

    var currentMeasurementUnits = myDocument.viewPreferences.horizontalMeasurementUnits;
    
    // TODO: Remove with-statements (deprecated).
    with(myDialog.dialogColumns.add()) {
        
        with(dialogRows.add()) {
            with(dialogColumns.add()) {
                staticTexts.add({staticLabel:"Information"});
            }
        }
        
        with(dialogRows.add()) {
            with(borderPanels.add()) {
                with(dialogColumns.add()) {
                    staticTexts.add({staticLabel:"You selected " + totalSelectedImages + " images."});
                    // Gets path of selected images for testing purposes.
                    // for(var i = 0; i < myImages.length; i++) {
                    // staticTexts.add({staticLabel:myImages[i]});
                    // }
                }
            }
        }

        with(dialogRows.add()) {
            with(dialogColumns.add()) {
                staticTexts.add({staticLabel:""});
                staticTexts.add({staticLabel:"Image Options"});
            }
        }

        with(dialogRows.add()) {
            with(borderPanels.add()) {
                with(dialogColumns.add()) {
                    staticTexts.add({staticLabel:"Image Width:"});
                    staticTexts.add({staticLabel:"Image Height:"});
                    staticTexts.add({staticLabel:"Image Bleed:"});
                    staticTexts.add({staticLabel:"Total Copies Per Image:"});
                    staticTexts.add({staticLabel:"Image Frame Filling:"});
                    staticTexts.add({staticLabel:"Optimize Page Orientation:"});
                }

                with(dialogColumns.add()) {
                    var myImageWidthField = measurementEditboxes.add({editUnits:currentMeasurementUnits});
                    var myImageHeightField = measurementEditboxes.add({editUnits:currentMeasurementUnits});
                    var myImageBleedField = measurementEditboxes.add({editUnits:currentMeasurementUnits,editValue:8.50393701}); // editValue is interprated in POINTS.
                    var myCopiesPerImageField = integerEditboxes.add();
                    var myImageFrameFittingOptions = dropdowns.add({stringList:["Center Content", "Content To Frame", "Fill Proportionally", "Proportionally"], selectedIndex:2});
                    var myOptimizePageOrientationOption = checkboxControls.add({checkedState:true});
                }
            }
        }
        
        with(dialogRows.add()) {
            with(dialogColumns.add()) {
                staticTexts.add({staticLabel:""});
                staticTexts.add({staticLabel:"Cropmark Options"});
            }
        }

        with(dialogRows.add()) {
            with(dialogColumns.add()) {
                with(borderPanels.add()) {
                    with(dialogColumns.add()) {
                        staticTexts.add({staticLabel:"Length:"});
                        staticTexts.add({staticLabel:"Offset:"});
                        staticTexts.add({staticLabel:"Stroke Weight:"});
                    }
        
                    with(dialogColumns.add()) {
                        var myCropmarksLengthField = measurementEditboxes.add({editUnits:MeasurementUnits.POINTS,editValue:8});
                        var myCropmarksOffsetField = measurementEditboxes.add({editUnits:MeasurementUnits.POINTS,editValue:5});
                        var myCropmarksStrokeWeightField = measurementEditboxes.add({editUnits:MeasurementUnits.POINTS,editValue:0.25});        
                    }
                }
            }
        }
    }

    var myResult = myDialog.show();

    if(myResult == true) {
        // Save selected images in variable.
        var selectedNumberOfImages = myImages.length;
        var myImageFiles = myImages;

        // Save image options/values in variables.
        var imageWidth = convertValueToDocumentMeasurementUnits(myImageWidthField.editValue);      // Convert POINTS value (default measurement units for scripts) to document measurement units.
        var imageHeight = convertValueToDocumentMeasurementUnits(myImageHeightField.editValue);    // Convert POINTS value (default measurement units for scripts) to document measurement units.
        var imageBleed = convertValueToDocumentMeasurementUnits(myImageBleedField.editValue);      // Convert POINTS value (default measurement units for scripts) to document measurement units.
        var copiesPerImage = myCopiesPerImageField.editValue;
        var fittingOption =myImageFrameFittingOptions.selectedIndex;
        var optimizeOrientation = myOptimizePageOrientationOption.checkedState;

        // Save cropmarks options/values in variables.
        var cropmarksLength = convertValueToDocumentMeasurementUnits(myCropmarksLengthField.editValue);
        var cropmarksOffset = convertValueToDocumentMeasurementUnits(myCropmarksOffsetField.editValue);
        var cropmarksStrokeWeight = convertValueToDocumentMeasurementUnits(myCropmarksStrokeWeightField.editValue);

        // Remove the dialog box from memory.
        myDialog.destroy();

        // Function to execute when dialog is closed.
        myMakeDocument(myImageFiles, copiesPerImage, imageWidth, imageHeight, imageBleed, fittingOption, optimizeOrientation, cropmarksLength, cropmarksOffset, cropmarksStrokeWeight);
    }
    else { // Function to execute when dialog button 'CANCEL' is clicked.
        // Remove the dialog box from memory.
        myDialog.destroy();
    }
}

function myMakeDocument(files, copiesPerImage, imageWidth, imageHeight, imageBleed, fittingOption, optimizeOrientation, cropmarksLength, cropmarksOffset, cropmarksStrokeWeight) {
   // Document variables.
    var myDocument = app.activeDocument;
    myDocument.documentPreferences.pagesPerDocument = 1; // Set initial page count to 1.
    
    // Image variables.
    var myNumberOfImages = files.length;
    var myImageRectangleHeight = Math.round((imageHeight + (2 * imageBleed)) * 10) / 10;
    var myImageRectangleWidth = Math.round((imageWidth + (2 * imageBleed)) * 10) / 10;
    var myCropmarksBoxWidth = Math.round((imageWidth + (2 * cropmarksLength) + (2 * cropmarksOffset)) * 10) / 10;
    var myCropmarksBoxHeight = Math.round((imageHeight + (2 * cropmarksLength) + (2 * cropmarksOffset)) * 10) / 10;
    var myCropmarksImageBoxHeightDifference = (myCropmarksBoxHeight - myImageRectangleHeight) / 2;
    var myCropmarksImageBoxWidthDifference = (myCropmarksBoxWidth - myImageRectangleWidth) / 2;

    // Optimize page orientation if optimizeOrientation is TRUE.
    if(optimizeOrientation === true) {
        setOptimizedOrientation(myCropmarksBoxWidth, myCropmarksBoxHeight);
    }

    // Get page width and height from current document.
    var myPageWidth = Math.round(myDocument.documentPreferences.pageWidth * 10) / 10;
    var myPageHeight = Math.round(myDocument.documentPreferences.pageHeight * 10) / 10;

    // Undefined variables.
    var maxColumns, maxRows, myTotalNumberOfPages, maxImagePerPage, imageRow, imageColumn;
    
    // Get max. available columns.
    if(myImageRectangleWidth > myCropmarksBoxWidth) {
        alert("Cropmarks are too small or bleed too large. Try again.");
        exit();
    } else {
        maxColumns = Math.floor(myPageWidth / myCropmarksBoxWidth);

        if(maxColumns === 0) {
            alert("The image is too wide to fit on the page. Choose different image dimensions or select a bigger page.");
            exit();
        }    
    }

    // Get max. available rows.
    if(myImageRectangleHeight > myCropmarksBoxHeight) {
        alert("Cropmarks are too small or bleed too large. Try again.");
        exit();
    } else {
        maxRows = Math.floor(myPageHeight / myCropmarksBoxHeight);

        if(maxRows === 0) {
            alert("The image is too high to fit on the page. Choose different image dimensions or select a bigger page.");
            exit();
        }
    }

    maxImagePerPage = maxColumns * maxRows;
    pagesPerImagesCopies = Math.ceil(copiesPerImage / maxImagePerPage);

    myTotalNumberOfPages = pagesPerImagesCopies * myNumberOfImages;

    // Calculate gutters based on page size.
    var singleColumnGutter = (myPageWidth - myCropmarksBoxWidth) / 2;  // Used when a page only fits a single image.
    var singleRowGutter = (myPageHeight - myCropmarksBoxHeight) / 2;   // Used when a page only fits a single image.

    var imageColumnGutter = (myPageWidth - (maxColumns * myCropmarksBoxWidth)) / (maxColumns - 1);  // Used when a page fit fit multiple images.
    var imageRowGutter = (myPageHeight - (maxRows * myCropmarksBoxHeight)) / (maxRows -1);          // Used when a page fit fit multiple images.

    with(myDocument) {
        for(var pageCounter = 0; pageCounter < myTotalNumberOfPages; pageCounter++) {
            var myCurrentPage = pages.item(pageCounter);

            with(myCurrentPage) {
                for(var rowCounter = 0; rowCounter < maxRows; rowCounter++) {                    
                    if (rowCounter !== maxRows && maxRows !== 1) {
                        imageRow = (myCropmarksBoxHeight + imageRowGutter) * rowCounter;
                    } else if (rowCounter === maxRows && maxRows === 1) {
                        imageRow = singleRowGutter;
                    } else {
                        imageRow = myCropmarksBoxHeight * rowCounter;
                    }

                    for(var columnCounter = 0; columnCounter < maxColumns; columnCounter++) {

                        // Create image rectangles.
                        var myImageRectangle = rectangles.add();
                        var currentImageIndex = Math.floor(pageCounter / pagesPerImagesCopies);

                        if (columnCounter !== maxColumns && maxColumns !== 1) {
                            imageColumn = (myCropmarksBoxWidth + imageColumnGutter) * columnCounter;
                        } else if (columnCounter === maxColumns && maxColumns === 1) {
                            imageColumn = singleColumnGutter;
                        } else {
                            imageColumn = myCropmarksBoxWidth * columnCounter;
                        }

                        with(myImageRectangle) {
                            geometricBounds = [myCropmarksImageBoxHeightDifference + imageRow, myCropmarksImageBoxWidthDifference + imageColumn, myImageRectangleHeight + myCropmarksImageBoxHeightDifference + imageRow, myImageRectangleWidth + myCropmarksImageBoxWidthDifference + imageColumn]; // geometricBounds([y, x, y + width, x + height])
                            fillColor = "None";
                            strokeColor = "None";
                            place(files[currentImageIndex]);
                            switch(fittingOption) {
                                case 0:
                                    fit(FitOptions.CENTER_CONTENT);
                                    break;
                    
                                case 1:
                                    fit(FitOptions.CONTENT_TO_FRAME);
                                    break;
                    
                                case 2:
                                    fit(FitOptions.FILL_PROPORTIONALLY);
                                    break;
                    
                                case 3:
                                    fit(FitOptions.PROPORTIONALLY);
                                    break;
                                
                                default:
                                    fit(FitOptions.FILL_PROPORTIONALLY);
                            }
                        }

                        // Get current geometricBounds of image rectangle.
                        var geometrixBoundsMyImageRecangle = myImageRectangle.geometricBounds;
                        var xcoordMyImageRectangle = geometrixBoundsMyImageRecangle[1] + imageBleed;
                        var ycoordMyImageRectangle = geometrixBoundsMyImageRecangle[0] + imageBleed;
                        var heightCropmarksBox = ycoordMyImageRectangle + imageHeight;
                        var widthCropmarksBox = xcoordMyImageRectangle + imageWidth;
                        
                        // Create cropmarks rectangles.
                        var myCropmarksRectangle = rectangles.add();

                        with(myCropmarksRectangle) {
                            geometricBounds = [ycoordMyImageRectangle, xcoordMyImageRectangle, heightCropmarksBox, widthCropmarksBox]; // geometricBounds([y, x, y + width, x + height])
                            fillColor = "None";
                            strokeColor = "None";
                        }

                        // Get current geometric bounds of cropmarks rectangle.
                        var geometrixBoundsMyCropmarksRectangle = myCropmarksRectangle.geometricBounds;
                        var xcoordMyCropmarksRectangle = geometrixBoundsMyCropmarksRectangle[1];
                        var ycoordMyCropmarksRectangle = geometrixBoundsMyCropmarksRectangle[0];
                        var heightCropmarksBox = ycoordMyCropmarksRectangle + imageHeight;
                        var widthCropmarksBox = xcoordMyCropmarksRectangle + imageWidth;

                        // Draw cropmarks arround cropmarks rectangle.
                        myDrawCropMarks(myCurrentPage, xcoordMyCropmarksRectangle, ycoordMyCropmarksRectangle, widthCropmarksBox, heightCropmarksBox, cropmarksLength, cropmarksOffset, cropmarksStrokeWeight);

                    }
                }
            }
            
            if(pageCounter < (myTotalNumberOfPages - 1)) {
                pages.add();
            }
        }
    }

    // Notify the user the script completed succesfully.
    alert("Action succesfull!");
    
}

function convertValueToDocumentMeasurementUnits(value) {
    var myDocument = app.activeDocument;
    var currentDocumentHorizontalMeasurementSettings = String(myDocument.viewPreferences.horizontalMeasurementUnits); // This script assumes horizontal units are equal to vertical units.
    
    var result;

    // Get measurement units from document preferences of current document and convert POINTS (default units for scripts) to selected measurement units.
    switch(currentDocumentHorizontalMeasurementSettings) {
        case 'PICAS':
            result = value * 0.0833333333; // 1 POINTS equals 0.0833333333 PICAS.
            break;

        case 'INCHES':
            result = value * 0.0138888889; // 1 POINTS equals 0.0138888889 INCHES.
            break;

        case 'MILLIMETERS':
            result = value * 0.352777778; // 1 POINTS equals 0.352777778 MILLIMETERS.
            break;

        case 'CENTIMETERS':
            result = value * 0.0352777778; // 1 POINTS equals 0.0352777778 CENTIMETERS.
            break;

        case 'CICEROS':
            result = value * 0.0781923408; // 1 POINTS equals 0.0781923408 CICEROS.
            break;

        case 'AGATES':
            result = value * 0.19444444444444609; // 1 POINTS equals 0.19444444444444609 AGATES.
            break;

        case 'PIXELS':
            result = value * 1; // 1 POINTS equals 1 PIXELS (In InDesign PIXELS are treated as equivelant to POINTS).
            break;

        default:
            result = value; // Default units for scripts is POINTS, no conversion of value neccesary.
    }

    return result;
}

// Select optimized page orientation based on image height and width.
function setOptimizedOrientation(cropmarkBoxWidth, cropmarkBoxHeight) {
    var myDocument = app.activeDocument;
    var currentDocumentOrientation = myDocument.documentPreferences.pageOrientation;

    var currentPageHeight = myDocument.documentPreferences.pageHeight;
    var currentPageWidth = myDocument.documentPreferences.pageWidth;

    var alternatePageHeight = myDocument.documentPreferences.pageWidth;
    var alternatePageWidth = myDocument.documentPreferences.pageHeight;

    currentMaxRows = Math.floor(currentPageHeight / cropmarkBoxHeight);
    alternateMaxRows = Math.floor(alternatePageHeight / cropmarkBoxHeight);

    currentMaxColumns = Math.floor(currentPageWidth / cropmarkBoxWidth);
    alternateMaxColumns = Math.floor(alternatePageWidth / cropmarkBoxWidth);

    var currentMaxImages = currentMaxRows * currentMaxColumns;
    var alternateMaxImages = alternateMaxRows * alternateMaxColumns;

    if(String(currentDocumentOrientation) === 'PORTRAIT' && alternateMaxImages > currentMaxImages) {
        myDocument.documentPreferences.pageOrientation = PageOrientation.LANDSCAPE;
    } else if (String(currentDocumentOrientation) == 'LANDSCAPE' && alternateMaxImages > currentMaxImages) {
        myDocument.documentPreferences.pageOrientation = PageOrientation.PORTRAIT;
    }
}

// Draw cropmarks around myCropmarksRectangle.
// Source: CropMarks.jsx (included with Adobe Indesign).
function myDrawCropMarks (myPage, myX1, myY1, myX2, myY2, myCropMarkLength, myCropMarkOffset, myCropMarkWidth){

	// Upper left crop mark pair.
	myDrawLine(myPage, [myY1, myX1-myCropMarkOffset, myY1, myX1-(myCropMarkOffset + myCropMarkLength)], myCropMarkWidth);
	myDrawLine(myPage, [myY1-myCropMarkOffset, myX1, myY1-(myCropMarkOffset+myCropMarkLength), myX1], myCropMarkWidth);

	// Lower left crop mark pair.
	myDrawLine(myPage, [myY2, myX1-myCropMarkOffset, myY2, myX1-(myCropMarkOffset+myCropMarkLength)], myCropMarkWidth);
	myDrawLine(myPage, [myY2+myCropMarkOffset, myX1, myY2+myCropMarkOffset+myCropMarkLength, myX1], myCropMarkWidth);

	// Upper right crop mark pair.
	myDrawLine(myPage, [myY1, myX2+myCropMarkOffset, myY1, myX2+myCropMarkOffset+myCropMarkLength], myCropMarkWidth);
	myDrawLine(myPage, [myY1-myCropMarkOffset, myX2, myY1-(myCropMarkOffset+myCropMarkLength), myX2], myCropMarkWidth);

	// Lower left crop mark pair.
	myDrawLine(myPage, [myY2, myX2+myCropMarkOffset, myY2, myX2+myCropMarkOffset+myCropMarkLength], myCropMarkWidth);
	myDrawLine(myPage, [myY2+myCropMarkOffset, myX2, myY2+myCropMarkOffset+myCropMarkLength, myX2], myCropMarkWidth);
}

// Draw cropmarks lines.
// Source: CropMarks.jsx (included with Adobe Indesign).
function myDrawLine(myPage, myBounds, myStrokeWeight){
	myPage.graphicLines.add({strokeWeight:myStrokeWeight, geometricBounds:myBounds})
}