(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global.ngmaps = global.ngmaps || {}, global.ngmaps.snazzyInfoWindow = {}),global.ng.core,null,null));
}(this, (function (exports,core,rxjs,operators) { 'use strict';

    var MapsAPILoader = /** @class */ (function () {
        function MapsAPILoader() {
        }
        MapsAPILoader.decorators = [
            { type: core.Injectable },
        ];
        return MapsAPILoader;
    }());

    /**
     * Wrapper class that handles the communication with the Google Maps Javascript
     * API v3
     */
    var GoogleMapsAPIWrapper = /** @class */ (function () {
        function GoogleMapsAPIWrapper(_loader, _zone) {
            var _this = this;
            this._loader = _loader;
            this._zone = _zone;
            this._map =
                new Promise(function (resolve) { _this._mapResolver = resolve; });
        }
        GoogleMapsAPIWrapper.prototype.createMap = function (el, mapOptions) {
            var _this = this;
            return this._zone.runOutsideAngular(function () {
                return _this._loader.load().then(function () {
                    var map = new google.maps.Map(el, mapOptions);
                    _this._mapResolver(map);
                    return;
                });
            });
        };
        GoogleMapsAPIWrapper.prototype.setMapOptions = function (options) {
            this._map.then(function (m) { m.setOptions(options); });
        };
        /**
         * Creates a google map marker with the map context
         */
        GoogleMapsAPIWrapper.prototype.createMarker = function (options, addToMap) {
            if (options === void 0) { options = {}; }
            if (addToMap === void 0) { addToMap = true; }
            return this._map.then(function (map) {
                if (addToMap) {
                    options.map = map;
                }
                return new google.maps.Marker(options);
            });
        };
        GoogleMapsAPIWrapper.prototype.createInfoWindow = function (options) {
            return this._map.then(function () { return new google.maps.InfoWindow(options); });
        };
        /**
         * Creates a google.map.Circle for the current map.
         */
        GoogleMapsAPIWrapper.prototype.createCircle = function (options) {
            return this._map.then(function (map) {
                options.map = map;
                return new google.maps.Circle(options);
            });
        };
        /**
         * Creates a google.map.Rectangle for the current map.
         */
        GoogleMapsAPIWrapper.prototype.createRectangle = function (options) {
            return this._map.then(function (map) {
                options.map = map;
                return new google.maps.Rectangle(options);
            });
        };
        GoogleMapsAPIWrapper.prototype.createPolyline = function (options) {
            return this.getNativeMap().then(function (map) {
                var line = new google.maps.Polyline(options);
                line.setMap(map);
                return line;
            });
        };
        GoogleMapsAPIWrapper.prototype.createPolygon = function (options) {
            return this.getNativeMap().then(function (map) {
                var polygon = new google.maps.Polygon(options);
                polygon.setMap(map);
                return polygon;
            });
        };
        /**
         * Creates a new google.map.Data layer for the current map
         */
        GoogleMapsAPIWrapper.prototype.createDataLayer = function (options) {
            return this._map.then(function (m) {
                var data = new google.maps.Data(options);
                data.setMap(m);
                return data;
            });
        };
        /**
         * Determines if given coordinates are insite a Polygon path.
         */
        GoogleMapsAPIWrapper.prototype.containsLocation = function (latLng, polygon) {
            return google.maps.geometry.poly.containsLocation(latLng, polygon);
        };
        GoogleMapsAPIWrapper.prototype.subscribeToMapEvent = function (eventName) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                _this._map.then(function (m) {
                    m.addListener(eventName, function (arg) { _this._zone.run(function () { return observer.next(arg); }); });
                });
            });
        };
        GoogleMapsAPIWrapper.prototype.clearInstanceListeners = function () {
            this._map.then(function (map) {
                google.maps.event.clearInstanceListeners(map);
            });
        };
        GoogleMapsAPIWrapper.prototype.setCenter = function (latLng) {
            return this._map.then(function (map) { return map.setCenter(latLng); });
        };
        GoogleMapsAPIWrapper.prototype.getZoom = function () { return this._map.then(function (map) { return map.getZoom(); }); };
        GoogleMapsAPIWrapper.prototype.getBounds = function () {
            return this._map.then(function (map) { return map.getBounds(); });
        };
        GoogleMapsAPIWrapper.prototype.getMapTypeId = function () {
            return this._map.then(function (map) { return map.getMapTypeId(); });
        };
        GoogleMapsAPIWrapper.prototype.setZoom = function (zoom) {
            return this._map.then(function (map) { return map.setZoom(zoom); });
        };
        GoogleMapsAPIWrapper.prototype.getCenter = function () {
            return this._map.then(function (map) { return map.getCenter(); });
        };
        GoogleMapsAPIWrapper.prototype.panTo = function (latLng) {
            return this._map.then(function (map) { return map.panTo(latLng); });
        };
        GoogleMapsAPIWrapper.prototype.panBy = function (x, y) {
            return this._map.then(function (map) { return map.panBy(x, y); });
        };
        GoogleMapsAPIWrapper.prototype.fitBounds = function (latLng) {
            return this._map.then(function (map) { return map.fitBounds(latLng); });
        };
        GoogleMapsAPIWrapper.prototype.panToBounds = function (latLng) {
            return this._map.then(function (map) { return map.panToBounds(latLng); });
        };
        /**
         * Returns the native Google Maps Map instance. Be careful when using this instance directly.
         */
        GoogleMapsAPIWrapper.prototype.getNativeMap = function () { return this._map; };
        /**
         * Triggers the given event name on the map instance.
         */
        GoogleMapsAPIWrapper.prototype.triggerMapEvent = function (eventName) {
            return this._map.then(function (m) { return google.maps.event.trigger(m, eventName); });
        };
        GoogleMapsAPIWrapper.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        GoogleMapsAPIWrapper.ctorParameters = function () { return [
            { type: MapsAPILoader },
            { type: core.NgZone }
        ]; };
        return GoogleMapsAPIWrapper;
    }());

    var MarkerManager = /** @class */ (function () {
        function MarkerManager(_mapsWrapper, _zone) {
            this._mapsWrapper = _mapsWrapper;
            this._zone = _zone;
            this._markers = new Map();
        }
        MarkerManager.prototype.deleteMarker = function (marker) {
            var _this = this;
            var m = this._markers.get(marker);
            if (m == null) {
                // marker already deleted
                return Promise.resolve();
            }
            return m.then(function (m) {
                return _this._zone.run(function () {
                    m.setMap(null);
                    _this._markers.delete(marker);
                });
            });
        };
        MarkerManager.prototype.updateMarkerPosition = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setPosition({ lat: marker.latitude, lng: marker.longitude }); });
        };
        MarkerManager.prototype.updateTitle = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setTitle(marker.title); });
        };
        MarkerManager.prototype.updateLabel = function (marker) {
            return this._markers.get(marker).then(function (m) { m.setLabel(marker.label); });
        };
        MarkerManager.prototype.updateDraggable = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setDraggable(marker.draggable); });
        };
        MarkerManager.prototype.updateIcon = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setIcon(marker.iconUrl); });
        };
        MarkerManager.prototype.updateOpacity = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setOpacity(marker.opacity); });
        };
        MarkerManager.prototype.updateVisible = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setVisible(marker.visible); });
        };
        MarkerManager.prototype.updateZIndex = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setZIndex(marker.zIndex); });
        };
        MarkerManager.prototype.updateClickable = function (marker) {
            return this._markers.get(marker).then(function (m) { return m.setClickable(marker.clickable); });
        };
        MarkerManager.prototype.updateAnimation = function (marker) {
            return this._markers.get(marker).then(function (m) {
                if (typeof marker.animation === 'string') {
                    m.setAnimation(google.maps.Animation[marker.animation]);
                }
                else {
                    m.setAnimation(marker.animation);
                }
            });
        };
        MarkerManager.prototype.addMarker = function (marker) {
            var markerPromise = this._mapsWrapper.createMarker({
                position: { lat: marker.latitude, lng: marker.longitude },
                label: marker.label,
                draggable: marker.draggable,
                icon: marker.iconUrl,
                opacity: marker.opacity,
                visible: marker.visible,
                zIndex: marker.zIndex,
                title: marker.title,
                clickable: marker.clickable,
                animation: (typeof marker.animation === 'string') ? google.maps.Animation[marker.animation] : marker.animation
            });
            this._markers.set(marker, markerPromise);
        };
        MarkerManager.prototype.getNativeMarker = function (marker) {
            return this._markers.get(marker);
        };
        MarkerManager.prototype.createEventObservable = function (eventName, marker) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                _this._markers.get(marker).then(function (m) {
                    m.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
                });
            });
        };
        MarkerManager.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        MarkerManager.ctorParameters = function () { return [
            { type: GoogleMapsAPIWrapper },
            { type: core.NgZone }
        ]; };
        return MarkerManager;
    }());

    var InfoWindowManager = /** @class */ (function () {
        function InfoWindowManager(_mapsWrapper, _zone, _markerManager) {
            this._mapsWrapper = _mapsWrapper;
            this._zone = _zone;
            this._markerManager = _markerManager;
            this._infoWindows = new Map();
        }
        InfoWindowManager.prototype.deleteInfoWindow = function (infoWindow) {
            var _this = this;
            var iWindow = this._infoWindows.get(infoWindow);
            if (iWindow == null) {
                // info window already deleted
                return Promise.resolve();
            }
            return iWindow.then(function (i) {
                return _this._zone.run(function () {
                    i.close();
                    _this._infoWindows.delete(infoWindow);
                });
            });
        };
        InfoWindowManager.prototype.setPosition = function (infoWindow) {
            return this._infoWindows.get(infoWindow).then(function (i) { return i.setPosition({
                lat: infoWindow.latitude,
                lng: infoWindow.longitude
            }); });
        };
        InfoWindowManager.prototype.setZIndex = function (infoWindow) {
            return this._infoWindows.get(infoWindow)
                .then(function (i) { return i.setZIndex(infoWindow.zIndex); });
        };
        InfoWindowManager.prototype.open = function (infoWindow) {
            var _this = this;
            return this._infoWindows.get(infoWindow).then(function (w) {
                if (infoWindow.hostMarker != null) {
                    return _this._markerManager.getNativeMarker(infoWindow.hostMarker).then(function (marker) {
                        return _this._mapsWrapper.getNativeMap().then(function (map) { return w.open(map, marker); });
                    });
                }
                return _this._mapsWrapper.getNativeMap().then(function (map) { return w.open(map); });
            });
        };
        InfoWindowManager.prototype.close = function (infoWindow) {
            return this._infoWindows.get(infoWindow).then(function (w) { return w.close(); });
        };
        InfoWindowManager.prototype.setOptions = function (infoWindow, options) {
            return this._infoWindows.get(infoWindow).then(function (i) { return i.setOptions(options); });
        };
        InfoWindowManager.prototype.addInfoWindow = function (infoWindow) {
            var options = {
                content: infoWindow.content,
                maxWidth: infoWindow.maxWidth,
                zIndex: infoWindow.zIndex,
                disableAutoPan: infoWindow.disableAutoPan
            };
            if (typeof infoWindow.latitude === 'number' && typeof infoWindow.longitude === 'number') {
                options.position = { lat: infoWindow.latitude, lng: infoWindow.longitude };
            }
            var infoWindowPromise = this._mapsWrapper.createInfoWindow(options);
            this._infoWindows.set(infoWindow, infoWindowPromise);
        };
        /**
         * Creates a Google Maps event listener for the given InfoWindow as an Observable
         */
        InfoWindowManager.prototype.createEventObservable = function (eventName, infoWindow) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                _this._infoWindows.get(infoWindow).then(function (i) {
                    i.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
                });
            });
        };
        InfoWindowManager.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        InfoWindowManager.ctorParameters = function () { return [
            { type: GoogleMapsAPIWrapper },
            { type: core.NgZone },
            { type: MarkerManager }
        ]; };
        return InfoWindowManager;
    }());

    /**
     * Class to implement when you what to be able to make it work with the auto fit bounds feature
     * of AGM.
     */
    var FitBoundsAccessor = /** @class */ (function () {
        function FitBoundsAccessor() {
        }
        return FitBoundsAccessor;
    }());

    var infoWindowId = 0;
    /**
     * AgmInfoWindow renders a info window inside a {@link AgmMarker} or standalone.
     *
     * ### Example
     * ```typescript
     * import { Component } from '@angular/core';
     *
     * @Component({
     *  selector: 'my-map-cmp',
     *  styles: [`
     *    .agm-map-container {
     *      height: 300px;
     *    }
     * `],
     *  template: `
     *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
     *      <agm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
     *        <agm-info-window [disableAutoPan]="true">
     *          Hi, this is the content of the <strong>info window</strong>
     *        </agm-info-window>
     *      </agm-marker>
     *    </agm-map>
     *  `
     * })
     * ```
     */
    var AgmInfoWindow = /** @class */ (function () {
        function AgmInfoWindow(_infoWindowManager, _el) {
            this._infoWindowManager = _infoWindowManager;
            this._el = _el;
            /**
             * Sets the open state for the InfoWindow. You can also call the open() and close() methods.
             */
            this.isOpen = false;
            /**
             * Emits an event when the info window is closed.
             */
            this.infoWindowClose = new core.EventEmitter();
            this._infoWindowAddedToManager = false;
            this._id = (infoWindowId++).toString();
        }
        AgmInfoWindow.prototype.ngOnInit = function () {
            this.content = this._el.nativeElement.querySelector('.agm-info-window-content');
            this._infoWindowManager.addInfoWindow(this);
            this._infoWindowAddedToManager = true;
            this._updateOpenState();
            this._registerEventListeners();
        };
        /** @internal */
        AgmInfoWindow.prototype.ngOnChanges = function (changes) {
            if (!this._infoWindowAddedToManager) {
                return;
            }
            if ((changes['latitude'] || changes['longitude']) && typeof this.latitude === 'number' &&
                typeof this.longitude === 'number') {
                this._infoWindowManager.setPosition(this);
            }
            if (changes['zIndex']) {
                this._infoWindowManager.setZIndex(this);
            }
            if (changes['isOpen']) {
                this._updateOpenState();
            }
            this._setInfoWindowOptions(changes);
        };
        AgmInfoWindow.prototype._registerEventListeners = function () {
            var _this = this;
            this._infoWindowManager.createEventObservable('closeclick', this).subscribe(function () {
                _this.isOpen = false;
                _this.infoWindowClose.emit();
            });
        };
        AgmInfoWindow.prototype._updateOpenState = function () {
            this.isOpen ? this.open() : this.close();
        };
        AgmInfoWindow.prototype._setInfoWindowOptions = function (changes) {
            var options = {};
            var optionKeys = Object.keys(changes).filter(function (k) { return AgmInfoWindow._infoWindowOptionsInputs.indexOf(k) !== -1; });
            optionKeys.forEach(function (k) { options[k] = changes[k].currentValue; });
            this._infoWindowManager.setOptions(this, options);
        };
        /**
         * Opens the info window.
         */
        AgmInfoWindow.prototype.open = function () { return this._infoWindowManager.open(this); };
        /**
         * Closes the info window.
         */
        AgmInfoWindow.prototype.close = function () {
            var _this = this;
            return this._infoWindowManager.close(this).then(function () { _this.infoWindowClose.emit(); });
        };
        /** @internal */
        AgmInfoWindow.prototype.id = function () { return this._id; };
        /** @internal */
        AgmInfoWindow.prototype.toString = function () { return 'AgmInfoWindow-' + this._id.toString(); };
        /** @internal */
        AgmInfoWindow.prototype.ngOnDestroy = function () { this._infoWindowManager.deleteInfoWindow(this); };
        AgmInfoWindow._infoWindowOptionsInputs = ['disableAutoPan', 'maxWidth'];
        AgmInfoWindow.decorators = [
            { type: core.Component, args: [{
                        selector: 'agm-info-window',
                        template: "<div class='agm-info-window-content'>\n      <ng-content></ng-content>\n    </div>\n  "
                    },] },
        ];
        /** @nocollapse */
        AgmInfoWindow.ctorParameters = function () { return [
            { type: InfoWindowManager },
            { type: core.ElementRef }
        ]; };
        AgmInfoWindow.propDecorators = {
            latitude: [{ type: core.Input }],
            longitude: [{ type: core.Input }],
            disableAutoPan: [{ type: core.Input }],
            zIndex: [{ type: core.Input }],
            maxWidth: [{ type: core.Input }],
            isOpen: [{ type: core.Input }],
            infoWindowClose: [{ type: core.Output }]
        };
        return AgmInfoWindow;
    }());

    var markerId = 0;
    /**
     * AgmMarker renders a map marker inside a {@link AgmMap}.
     *
     * ### Example
     * ```typescript
     * import { Component } from '@angular/core';
     *
     * @Component({
     *  selector: 'my-map-cmp',
     *  styles: [`
     *    .agm-map-container {
     *      height: 300px;
     *    }
     * `],
     *  template: `
     *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
     *      <agm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
     *      </agm-marker>
     *    </agm-map>
     *  `
     * })
     * ```
     */
    var AgmMarker = /** @class */ (function () {
        function AgmMarker(_markerManager) {
            this._markerManager = _markerManager;
            /**
             * If true, the marker can be dragged. Default value is false.
             */
            // tslint:disable-next-line:no-input-rename
            this.draggable = false;
            /**
             * If true, the marker is visible
             */
            this.visible = true;
            /**
             * Whether to automatically open the child info window when the marker is clicked.
             */
            this.openInfoWindow = true;
            /**
             * The marker's opacity between 0.0 and 1.0.
             */
            this.opacity = 1;
            /**
             * All markers are displayed on the map in order of their zIndex, with higher values displaying in
             * front of markers with lower values. By default, markers are displayed according to their
             * vertical position on screen, with lower markers appearing in front of markers further up the
             * screen.
             */
            this.zIndex = 1;
            /**
             * If true, the marker can be clicked. Default value is true.
             */
            // tslint:disable-next-line:no-input-rename
            this.clickable = true;
            /**
             * This event emitter gets emitted when the user clicks on the marker.
             */
            this.markerClick = new core.EventEmitter();
            /**
             * This event is fired when the user rightclicks on the marker.
             */
            this.markerRightClick = new core.EventEmitter();
            /**
             * This event is fired when the user stops dragging the marker.
             */
            this.dragEnd = new core.EventEmitter();
            /**
             * This event is fired when the user mouses over the marker.
             */
            this.mouseOver = new core.EventEmitter();
            /**
             * This event is fired when the user mouses outside the marker.
             */
            this.mouseOut = new core.EventEmitter();
            /**
             * @internal
             */
            this.infoWindow = new core.QueryList();
            this._markerAddedToManger = false;
            this._observableSubscriptions = [];
            this._fitBoundsDetails$ = new rxjs.ReplaySubject(1);
            this._id = (markerId++).toString();
        }
        /* @internal */
        AgmMarker.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.handleInfoWindowUpdate();
            this.infoWindow.changes.subscribe(function () { return _this.handleInfoWindowUpdate(); });
        };
        AgmMarker.prototype.handleInfoWindowUpdate = function () {
            var _this = this;
            if (this.infoWindow.length > 1) {
                throw new Error('Expected no more than one info window.');
            }
            this.infoWindow.forEach(function (marker) {
                marker.hostMarker = _this;
            });
        };
        /** @internal */
        AgmMarker.prototype.ngOnChanges = function (changes) {
            if (typeof this.latitude === 'string') {
                this.latitude = Number(this.latitude);
            }
            if (typeof this.longitude === 'string') {
                this.longitude = Number(this.longitude);
            }
            if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
                return;
            }
            if (!this._markerAddedToManger) {
                this._markerManager.addMarker(this);
                this._updateFitBoundsDetails();
                this._markerAddedToManger = true;
                this._addEventListeners();
                return;
            }
            if (changes['latitude'] || changes['longitude']) {
                this._markerManager.updateMarkerPosition(this);
                this._updateFitBoundsDetails();
            }
            if (changes['title']) {
                this._markerManager.updateTitle(this);
            }
            if (changes['label']) {
                this._markerManager.updateLabel(this);
            }
            if (changes['draggable']) {
                this._markerManager.updateDraggable(this);
            }
            if (changes['iconUrl']) {
                this._markerManager.updateIcon(this);
            }
            if (changes['opacity']) {
                this._markerManager.updateOpacity(this);
            }
            if (changes['visible']) {
                this._markerManager.updateVisible(this);
            }
            if (changes['zIndex']) {
                this._markerManager.updateZIndex(this);
            }
            if (changes['clickable']) {
                this._markerManager.updateClickable(this);
            }
            if (changes['animation']) {
                this._markerManager.updateAnimation(this);
            }
        };
        /**
         * @internal
         */
        AgmMarker.prototype.getFitBoundsDetails$ = function () {
            return this._fitBoundsDetails$.asObservable();
        };
        AgmMarker.prototype._updateFitBoundsDetails = function () {
            this._fitBoundsDetails$.next({ latLng: { lat: this.latitude, lng: this.longitude } });
        };
        AgmMarker.prototype._addEventListeners = function () {
            var _this = this;
            var cs = this._markerManager.createEventObservable('click', this).subscribe(function () {
                if (_this.openInfoWindow) {
                    _this.infoWindow.forEach(function (infoWindow) { return infoWindow.open(); });
                }
                _this.markerClick.emit(_this);
            });
            this._observableSubscriptions.push(cs);
            var rc = this._markerManager.createEventObservable('rightclick', this).subscribe(function () {
                _this.markerRightClick.emit(null);
            });
            this._observableSubscriptions.push(rc);
            var ds = this._markerManager.createEventObservable('dragend', this)
                .subscribe(function (e) {
                _this.dragEnd.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
            });
            this._observableSubscriptions.push(ds);
            var mover = this._markerManager.createEventObservable('mouseover', this)
                .subscribe(function (e) {
                _this.mouseOver.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
            });
            this._observableSubscriptions.push(mover);
            var mout = this._markerManager.createEventObservable('mouseout', this)
                .subscribe(function (e) {
                _this.mouseOut.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
            });
            this._observableSubscriptions.push(mout);
        };
        /** @internal */
        AgmMarker.prototype.id = function () { return this._id; };
        /** @internal */
        AgmMarker.prototype.toString = function () { return 'AgmMarker-' + this._id.toString(); };
        /** @internal */
        AgmMarker.prototype.ngOnDestroy = function () {
            this._markerManager.deleteMarker(this);
            // unsubscribe all registered observable subscriptions
            this._observableSubscriptions.forEach(function (s) { return s.unsubscribe(); });
        };
        AgmMarker.decorators = [
            { type: core.Directive, args: [{
                        selector: 'agm-marker',
                        providers: [
                            { provide: FitBoundsAccessor, useExisting: core.forwardRef(function () { return AgmMarker; }) }
                        ],
                        inputs: [
                            'latitude', 'longitude', 'title', 'label', 'draggable: markerDraggable', 'iconUrl',
                            'openInfoWindow', 'opacity', 'visible', 'zIndex', 'animation'
                        ],
                        outputs: ['markerClick', 'dragEnd', 'mouseOver', 'mouseOut']
                    },] },
        ];
        /** @nocollapse */
        AgmMarker.ctorParameters = function () { return [
            { type: MarkerManager }
        ]; };
        AgmMarker.propDecorators = {
            latitude: [{ type: core.Input }],
            longitude: [{ type: core.Input }],
            title: [{ type: core.Input }],
            label: [{ type: core.Input }],
            draggable: [{ type: core.Input, args: ['markerDraggable',] }],
            iconUrl: [{ type: core.Input }],
            visible: [{ type: core.Input }],
            openInfoWindow: [{ type: core.Input }],
            opacity: [{ type: core.Input }],
            zIndex: [{ type: core.Input }],
            clickable: [{ type: core.Input, args: ['markerClickable',] }],
            markerClick: [{ type: core.Output }],
            markerRightClick: [{ type: core.Output }],
            dragEnd: [{ type: core.Output }],
            mouseOver: [{ type: core.Output }],
            mouseOut: [{ type: core.Output }],
            infoWindow: [{ type: core.ContentChildren, args: [AgmInfoWindow,] }]
        };
        return AgmMarker;
    }());

    var WindowRef = /** @class */ (function () {
        function WindowRef() {
        }
        WindowRef.prototype.getNativeWindow = function () { return window; };
        return WindowRef;
    }());
    var DocumentRef = /** @class */ (function () {
        function DocumentRef() {
        }
        DocumentRef.prototype.getNativeDocument = function () { return document; };
        return DocumentRef;
    }());

    var __extends = (window && window.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var GoogleMapsScriptProtocol;
    (function (GoogleMapsScriptProtocol) {
        GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTP"] = 1] = "HTTP";
        GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTPS"] = 2] = "HTTPS";
        GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["AUTO"] = 3] = "AUTO";
    })(GoogleMapsScriptProtocol || (GoogleMapsScriptProtocol = {}));
    /**
     * Token for the config of the LazyMapsAPILoader. Please provide an object of type {@link
     * LazyMapsAPILoaderConfig}.
     */
    var LAZY_MAPS_API_CONFIG = new core.InjectionToken('angular-google-maps LAZY_MAPS_API_CONFIG');
    var LazyMapsAPILoader = /** @class */ (function (_super) {
        __extends(LazyMapsAPILoader, _super);
        function LazyMapsAPILoader(config, w, d) {
            if (config === void 0) { config = null; }
            var _this = _super.call(this) || this;
            _this._SCRIPT_ID = 'agmGoogleMapsApiScript';
            _this.callbackName = "agmLazyMapsAPILoader";
            _this._config = config || {};
            _this._windowRef = w;
            _this._documentRef = d;
            return _this;
        }
        LazyMapsAPILoader.prototype.load = function () {
            var window = this._windowRef.getNativeWindow();
            if (window.google && window.google.maps) {
                // Google maps already loaded on the page.
                return Promise.resolve();
            }
            if (this._scriptLoadingPromise) {
                return this._scriptLoadingPromise;
            }
            // this can happen in HMR situations or Stackblitz.io editors.
            var scriptOnPage = this._documentRef.getNativeDocument().getElementById(this._SCRIPT_ID);
            if (scriptOnPage) {
                this._assignScriptLoadingPromise(scriptOnPage);
                return this._scriptLoadingPromise;
            }
            var script = this._documentRef.getNativeDocument().createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.id = this._SCRIPT_ID;
            script.src = this._getScriptSrc(this.callbackName);
            this._assignScriptLoadingPromise(script);
            this._documentRef.getNativeDocument().body.appendChild(script);
            return this._scriptLoadingPromise;
        };
        LazyMapsAPILoader.prototype._assignScriptLoadingPromise = function (scriptElem) {
            var _this = this;
            this._scriptLoadingPromise = new Promise(function (resolve, reject) {
                _this._windowRef.getNativeWindow()[_this.callbackName] = function () {
                    resolve();
                };
                scriptElem.onerror = function (error) {
                    reject(error);
                };
            });
        };
        LazyMapsAPILoader.prototype._getScriptSrc = function (callbackName) {
            var protocolType = (this._config && this._config.protocol) || GoogleMapsScriptProtocol.HTTPS;
            var protocol;
            switch (protocolType) {
                case GoogleMapsScriptProtocol.AUTO:
                    protocol = '';
                    break;
                case GoogleMapsScriptProtocol.HTTP:
                    protocol = 'http:';
                    break;
                case GoogleMapsScriptProtocol.HTTPS:
                    protocol = 'https:';
                    break;
            }
            var hostAndPath = this._config.hostAndPath || 'maps.googleapis.com/maps/api/js';
            var queryParams = {
                v: this._config.apiVersion || '3',
                callback: callbackName,
                key: this._config.apiKey,
                client: this._config.clientId,
                channel: this._config.channel,
                libraries: this._config.libraries,
                region: this._config.region,
                language: this._config.language
            };
            var params = Object.keys(queryParams)
                .filter(function (k) { return queryParams[k] != null; })
                .filter(function (k) {
                // remove empty arrays
                return !Array.isArray(queryParams[k]) ||
                    (Array.isArray(queryParams[k]) && queryParams[k].length > 0);
            })
                .map(function (k) {
                // join arrays as comma seperated strings
                var i = queryParams[k];
                if (Array.isArray(i)) {
                    return { key: k, value: i.join(',') };
                }
                return { key: k, value: queryParams[k] };
            })
                .map(function (entry) {
                return entry.key + "=" + entry.value;
            })
                .join('&');
            return protocol + "//" + hostAndPath + "?" + params;
        };
        LazyMapsAPILoader.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        LazyMapsAPILoader.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [LAZY_MAPS_API_CONFIG,] }] },
            { type: WindowRef },
            { type: DocumentRef }
        ]; };
        return LazyMapsAPILoader;
    }(MapsAPILoader));

    /**
     * When using the NoOpMapsAPILoader, the Google Maps API must be added to the page via a `<script>`
     * Tag.
     * It's important that the Google Maps API script gets loaded first on the page.
     */

    // main modules

    var AgmSnazzyInfoWindow = /** @class */ (function () {
        function AgmSnazzyInfoWindow(_marker, _wrapper, _manager, _loader) {
            this._marker = _marker;
            this._wrapper = _wrapper;
            this._manager = _manager;
            this._loader = _loader;
            /**
             * Changes the open status of the snazzy info window.
             */
            this.isOpen = false;
            /**
             * Emits when the open status changes.
             */
            this.isOpenChange = new core.EventEmitter();
            /**
             * Choose where you want the info window to be displayed, relative to the marker.
             */
            this.placement = 'top';
            /**
             * The max width in pixels of the info window.
             */
            this.maxWidth = 200;
            /**
             * The max height in pixels of the info window.
             */
            this.maxHeight = 200;
            /**
             * Determines if the info window will open when the marker is clicked.
             * An internal listener is added to the Google Maps click event which calls the open() method.
             */
            this.openOnMarkerClick = true;
            /**
             * Determines if the info window will close when the map is clicked. An internal listener is added to the Google Maps click event which calls the close() method.
             * This will not activate on the Google Maps drag event when the user is panning the map.
             */
            this.closeOnMapClick = true;
            /**
             * Determines if the info window will close when any other Snazzy Info Window is opened.
             */
            this.closeWhenOthersOpen = false;
            /**
             * Determines if the info window will show a close button.
             */
            this.showCloseButton = true;
            /**
             * Determines if the info window will be panned into view when opened.
             */
            this.panOnOpen = true;
            /**
             * Emits before the info window opens.
             */
            this.beforeOpen = new core.EventEmitter();
            /**
             * Emits before the info window closes.
             */
            this.afterClose = new core.EventEmitter();
            this._snazzyInfoWindowInitialized = null;
        }
        /**
         * @internal
         */
        AgmSnazzyInfoWindow.prototype.ngOnChanges = function (changes) {
            if (this._nativeSnazzyInfoWindow == null) {
                return;
            }
            if ('isOpen' in changes && this.isOpen) {
                this._openInfoWindow();
            }
            else if ('isOpen' in changes && !this.isOpen) {
                this._closeInfoWindow();
            }
            if (('latitude' in changes || 'longitude' in changes) && this._marker == null) {
                this._updatePosition();
            }
        };
        /**
         * @internal
         */
        AgmSnazzyInfoWindow.prototype.ngAfterViewInit = function () {
            var _this = this;
            var m = this._manager != null ? this._manager.getNativeMarker(this._marker) : null;
            this._snazzyInfoWindowInitialized = this._loader.load()
                .then(function () { return require('snazzy-info-window'); })
                .then(function (module) { return Promise.all([module, m, _this._wrapper.getNativeMap()]); })
                .then(function (elems) {
                var options = {
                    map: elems[2],
                    content: '',
                    placement: _this.placement,
                    maxWidth: _this.maxWidth,
                    maxHeight: _this.maxHeight,
                    backgroundColor: _this.backgroundColor,
                    padding: _this.padding,
                    border: _this.border,
                    borderRadius: _this.borderRadius,
                    fontColor: _this.fontColor,
                    pointer: _this.pointer,
                    shadow: _this.shadow,
                    closeOnMapClick: _this.closeOnMapClick,
                    openOnMarkerClick: _this.openOnMarkerClick,
                    closeWhenOthersOpen: _this.closeWhenOthersOpen,
                    showCloseButton: _this.showCloseButton,
                    panOnOpen: _this.panOnOpen,
                    wrapperClass: _this.wrapperClass,
                    callbacks: {
                        beforeOpen: function () {
                            _this._createViewContent();
                            _this.beforeOpen.emit();
                        },
                        afterOpen: function () {
                            _this.isOpenChange.emit(_this.openStatus());
                        },
                        afterClose: function () {
                            _this.afterClose.emit();
                            _this.isOpenChange.emit(_this.openStatus());
                        }
                    }
                };
                if (elems[1] != null) {
                    options.marker = elems[1];
                }
                else {
                    options.position = {
                        lat: _this.latitude,
                        lng: _this.longitude
                    };
                }
                _this._nativeSnazzyInfoWindow = new elems[0](options);
            });
            this._snazzyInfoWindowInitialized.then(function () {
                if (_this.isOpen) {
                    _this._openInfoWindow();
                }
            });
        };
        AgmSnazzyInfoWindow.prototype._openInfoWindow = function () {
            var _this = this;
            this._snazzyInfoWindowInitialized.then(function () {
                _this._createViewContent();
                _this._nativeSnazzyInfoWindow.open();
            });
        };
        AgmSnazzyInfoWindow.prototype._closeInfoWindow = function () {
            var _this = this;
            this._snazzyInfoWindowInitialized.then(function () {
                _this._nativeSnazzyInfoWindow.close();
            });
        };
        AgmSnazzyInfoWindow.prototype._createViewContent = function () {
            if (this._viewContainerRef.length === 1) {
                return;
            }
            var evr = this._viewContainerRef.createEmbeddedView(this._templateRef);
            this._nativeSnazzyInfoWindow.setContent(this._outerWrapper.nativeElement);
            // we have to run this in a separate cycle.
            setTimeout(function () {
                evr.detectChanges();
            });
        };
        AgmSnazzyInfoWindow.prototype._updatePosition = function () {
            this._nativeSnazzyInfoWindow.setPosition({
                lat: this.latitude,
                lng: this.longitude
            });
        };
        /**
         * Returns true when the Snazzy Info Window is initialized and open.
         */
        AgmSnazzyInfoWindow.prototype.openStatus = function () {
            return this._nativeSnazzyInfoWindow && this._nativeSnazzyInfoWindow.isOpen();
        };
        /**
         * @internal
         */
        AgmSnazzyInfoWindow.prototype.ngOnDestroy = function () {
            if (this._nativeSnazzyInfoWindow) {
                this._nativeSnazzyInfoWindow.destroy();
            }
        };
        AgmSnazzyInfoWindow.decorators = [
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'agm-snazzy-info-window',
                        template: '<div #outerWrapper><div #viewContainer></div></div><ng-content></ng-content>'
                    },] },
        ];
        /** @nocollapse */
        AgmSnazzyInfoWindow.ctorParameters = function () { return [
            { type: AgmMarker, decorators: [{ type: core.Optional }, { type: core.Host }, { type: core.SkipSelf }] },
            { type: GoogleMapsAPIWrapper },
            { type: MarkerManager },
            { type: MapsAPILoader }
        ]; };
        AgmSnazzyInfoWindow.propDecorators = {
            latitude: [{ type: core.Input }],
            longitude: [{ type: core.Input }],
            isOpen: [{ type: core.Input }],
            isOpenChange: [{ type: core.Output }],
            placement: [{ type: core.Input }],
            maxWidth: [{ type: core.Input }],
            maxHeight: [{ type: core.Input }],
            backgroundColor: [{ type: core.Input }],
            padding: [{ type: core.Input }],
            border: [{ type: core.Input }],
            borderRadius: [{ type: core.Input }],
            fontColor: [{ type: core.Input }],
            fontSize: [{ type: core.Input }],
            pointer: [{ type: core.Input }],
            shadow: [{ type: core.Input }],
            openOnMarkerClick: [{ type: core.Input }],
            closeOnMapClick: [{ type: core.Input }],
            wrapperClass: [{ type: core.Input }],
            closeWhenOthersOpen: [{ type: core.Input }],
            showCloseButton: [{ type: core.Input }],
            panOnOpen: [{ type: core.Input }],
            beforeOpen: [{ type: core.Output }],
            afterClose: [{ type: core.Output }],
            _outerWrapper: [{ type: core.ViewChild, args: ['outerWrapper', { read: core.ElementRef },] }],
            _viewContainerRef: [{ type: core.ViewChild, args: ['viewContainer', { read: core.ViewContainerRef },] }],
            _templateRef: [{ type: core.ContentChild, args: [core.TemplateRef,] }]
        };
        return AgmSnazzyInfoWindow;
    }());

    var AgmSnazzyInfoWindowModule = /** @class */ (function () {
        function AgmSnazzyInfoWindowModule() {
        }
        AgmSnazzyInfoWindowModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [AgmSnazzyInfoWindow],
                        exports: [AgmSnazzyInfoWindow]
                    },] },
        ];
        return AgmSnazzyInfoWindowModule;
    }());

    // public API

    exports.AgmSnazzyInfoWindowModule = AgmSnazzyInfoWindowModule;
    exports.AgmSnazzyInfoWindow = AgmSnazzyInfoWindow;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
