# WahlFoo

This is a chart of the outcome of the Austrian Federal President vote in 2016.
It is a d3-reimplementation of the "Sprengelergebnis" of this page:
[https://wahlarchiv.wienerzeitung.at/wahl/bundespraesident/wien/2016/wien+51025/](https://wahlarchiv.wienerzeitung.at/wahl/bundespraesident/wien/2016/wien+51025/)

The goal is to highlight the performance issues.
The Version on the WienerZeitung page takes about 500ms on my Laptop (with a i7-3630QM) to rerender when hovering oer the bar chart.
My Version takes 50ms, with only 6ms used for scripting.

The code is admittedly not beautiful and was hacked together within 2 to 3 hours. It is rather a POC than an actual result.

A demo can be found [here](https://luaks.github.io/wahlFoo/)

## How do I run this?
You will need [webpack](https://webpack.github.io/) installed to build this.
Build it by running this:
```
$ npm install
$ webpack
```

There now is a build folder, containing an index.html you can just open.

Another approach is to host a dev server with `webpack-dev-server`:
```
$ npm install
$ webpack-dev-server
```

You can now open [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) in your browser.

## Why is this faster?
The map itself is never completely redrawn, only attributes of the individual elements are updated.
This way the most expensive operation, the initial generation and rendering of the shapes, is only executed once, whereas with a canvas you have to take care of redrawing everything .

## Where does the data come from?
The data comes from data.gv.at and wien.gv.at

[https://www.data.gv.at/katalog/dataset/79c1030d-5cf6-4d58-ade6-02f66fb4dffb](https://www.data.gv.at/katalog/dataset/79c1030d-5cf6-4d58-ade6-02f66fb4dffb)

[https://www.wien.gv.at/wahlergebnis/de/BP161/index.html](https://www.wien.gv.at/wahlergebnis/de/BP161/index.html)

I transformed both datasets to better fit my needs. (Although it did not always go as planned, e.g. Sprengel 22004)

## Why did I do it?
I've recently done quite a lot of performance optimizations and thought it'd be fun to rebuild this from the ground up. I