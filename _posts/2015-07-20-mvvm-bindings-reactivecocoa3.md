---
layout: post
title: How I do MVVM Bindings with ReactiveCocoa 3
date:   2015-07-20 16:00:21
categories: iOS
---

The first Release Candidate for the ReactiveCocoa 3 (aka The Swift Edition) has just been announced, so I thought this was a good time to share how I have been doing MVVM bindings with the new version of the framework.

Unfortunately (or fortunately, depending on the point of view), Swift does not play well with KVO, which is a very Objective-C way of doing things. KVO is great, but it was also the main source of RAC's "magic".  
For this reason `MutableProperty`, a more formal and explicit way to do bindings, was introduced in the Swift version of RAC.

The most common scenario in iOS is having a bunch of `UITableViewCell`s or `UICollectionViewCell`s and keep their content up to date with the latest ViewModel.
What I like to do is having a `MutableProperty` wrapping the ViewModel and _describe_ the bindings once during the initialization of the cell, letting the framework stream the new values whenever the ViewModel changes.

In code this translates to something like this:

```swift
protocol ViewModelCell {
    typealias T
    var viewModel: MutableProperty<T?> { get }
}

class ExerciseSetCell: UITableViewCell, ViewModelCell {
    @IBOutlet weak var numberLabel: UILabel!
    @IBOutlet weak var currentWeightTextField: UITextField!
    @IBOutlet weak var repsTextField: UITextField!
    
    var viewModel: MutableProperty<ExerciseSetViewModel?> = MutableProperty(nil)
    
    override func awakeFromNib() {
        super.awakeFromNib()
        setupBindings()
    }
    
     func setupBindings() {
        numberLabel.rac_text <~ viewModel.producer |> ignoreNil |> map { $0.number }
        currentWeightTextField.rac_text <~ viewModel.producer |> ignoreNil |> map { $0.currentWeight }
        repsTextField.rac_text <~ viewModel.producer |> ignoreNil |> map { $0.reps }
    }
}
```

Note that to accomplish this I used the UIKit extension `rac_text`. Unfortunately those extensions are not present in the framework yet, so you'd have to create them yourself for now. [Colin Eberhardt's post](http://blog.scottlogic.com/2015/05/15/mvvm-reactive-cocoa-3.html) is a good starting point.

Since I don't really know what I'm doing, I'm open to suggestion. Please reach me out [on Twitter](https://twitter.com/marcosero) if you have some!

