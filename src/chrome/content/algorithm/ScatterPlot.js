/*
    Copyright (C) 2012 Bluejay

    This file is part of Bluejay.

    Bluejay is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Bluejay is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Bluejay.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Name: ScatterPlot
 * Description: the ScatterPlot represents a bunch of Datapoints that 
 * have x, y, and weight. It is used to predict y from x
 * Currently it uses nearby x-values although it could later be changed 
 * to compute the least-squares-regression-line if that is a better estimate
 */
 
 function ScatterPlot() {
	/* public function */
	
	//this.ScatterPlot = ScatterPlot;
	this.addDataPoint = addDataPoint;
	this.predict = predict;
    this.getNumPoints = getNumPoints;
    this.predictInternal = predictInternal;
    this.split = split;
	
	//private variables
	var datapoints = [];
	var debugHistory = [];
	//var upperChild; // don't initialize here because that creates an infinite loop // = new ScatterPlot();
	//var lowerChild; // don't initialize here because that creates an infinite loop // = new ScatterPlot();
     var totalWeight = 0.0;
     var totalRating = 0.0;
     var minInput = 1000;
     var maxInput = -1000;
     var lowerChild = null;
     var upperChild = null;
	
	/* public function definition */
	// add data point
     function addDataPoint(datapoint) {
         totalRating = totalRating + datapoint.getY() * datapoint.getWeight();
         totalWeight = totalWeight + datapoint.getWeight();
         if (minInput > datapoint.getX()) {
             minInput = datapoint.getX();
         }
         if (maxInput < datapoint.getX()) {
             maxInput = datapoint.getX();
         }
         if (lowerChild != null) {
             if (datapoint.getX() < (minInput + maxInput) / 2) {
                 lowerChild.addDataPoint(datapoint);
             } else {
                 upperChild.addDataPoint(datapoint);
             }
         }
	}

     // estimates Y for the given X
     function predict(x) {
         return predictInternal(x, totalWeight);
     }

     // estimates Y for the given X
     // rootWeight is the weight of the root ScatterPlot (the ScatterPlot's are nested)
     function predictInternal(x, rootWeight) {
         var ourAverage = new Distribution((totalRating + 1) / (totalWeight + 2), 1.0 / totalWeight, totalWeight);
         if (totalWeight * totalWeight <= rootWeight) {
             // We recursed as far as our data warranted; now just return the result
             return ourAverage;
         }
         if (lowerChild == null) {
             split();
         }
         var childPrediction = null;

         if (x < (minInput + maxInput) / 2) {
             childPrediction = lowerChild.predictInternal(x, rootWeight);
         } else {
             childPrediction = upperChild.predictInternal(x, rootWeight);
         }
         if (childPrediction.getWeight() * childPrediction.getWeight() <= rootWeight) {
             // Child didn't have enough data for a good prediction; use ours instead
             return ourAverage;
         }
         return childPrediction;
     }

     function split() {
         var i = 0;
         var middleInput = (minInput + maxInput) / 2;
         lowerChild = new ScatterPlot();
         upperChild = new ScatterPlot();

         for (i = 0; i < datapoints.length; i++) {
             var datapoint = datapoints[i];
             if (datapoint.getX() < middleInput) {
                 lowerChild.addDataPoint(datapoint);
             } else {
                 upperChild.addDataPoint(datapoint);
             }
         }
     }
	
	// Tells how many points there are from which to predict
	// This is different from the total weight
	function getNumPoints() {
		return datapoints.length;
	}
 
 }
