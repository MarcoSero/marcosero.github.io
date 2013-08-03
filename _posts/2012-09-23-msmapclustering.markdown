---
layout: post
title:  "MSMapClustering"
date:   2012-10-02 21:35:46
categories: Ruby Github
---

During development of my thesis project (that consists _also_ in an iOS app on which I'll write when it will be done) I looked for a way to cluster pins inside a map view, like Photos.app does with photos on the map.

I wanted something like that:

![MSMapClustering][1]

and I was extremely negatively surprised when I discovered that such a feature wasn't default.

For that reason, I developed a reusable component, **[MSMapClustering][2]**,  that lets me (and every one else) to create a map view that automatically clusters its pins based on the zoom level.

The code is freely adaped from an Apple tutorial of WWDC 2010, I've packed it into these classes to make a reusable component for my future works.

You can find it on my [GitHub][2].

Here's a quick tutorial on how to use it:

### Structure

There are three main classes:

- `MSMapClustering`, a subclass of MKMapView
- `MSMapClusteringDelegate`, the class delegate that conforms to protocol `<MKMapViewDelegate>`
- `MSAnnotation`, a class that conforms to protocol `<MKAnnotation>`

### Usage

Include in your project the three classes above and then create your map view and its delegate:

    MSMapClustering *mapView = [[MSMapClustering alloc] init];
  mapView.delegate = [[MSMapClusteringDelegate alloc] initWithMapView:mapView];
  
Add annotations using these methods

    - (void)addMSAnnotation:(MSAnnotation *)annotation;
    - (void)addMSAnnotations:(NSArray *)annotations;
    
Implement the delegate's method in the class MSMapClusteringDelegate (obviously!), but pay attention changing methods already inside it.

If you want, you could set `marginFactor` and `bucketSize` parameters in `MSMapClusteringDelegate.m`.

- `marginFactor`: this value controls the number of off screen annotations are displayed.  
A bigger number means more annotations, less chance of seeing annotations views pop in but decreased performance.  
A smaller number means fewer annotations, more chance of seeing annotations views pop in but better performance.
- `bucketSize`: adjust this roughly based on the dimensions of your annotations views.  
Bigger numbers more aggressively coalesce annotations (fewer annotations displayed but better performance).
Numbers too small result in overlapping annotations views and too many annotations in screen.

### Other Infos

I included a demo application that shows how to implement this component.  
Please remember that MapKit framework is required.

Play with it and feel free to ask me whatever you want. Hope it's useful.


  [1]: https://a248.e.akamai.net/camo.github.com/350222f5f17f5ea154e603e49d67f19eca0c2924/687474703a2f2f662e636c2e6c792f6974656d732f306b306c3263314a3377334b30353347334d31452f6d61705f6c61726765322e676966

  [2]: https://github.com/MarcoSero/MSMapClustering