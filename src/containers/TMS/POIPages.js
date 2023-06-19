import React, { Fragment, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { GMap } from 'primereact/gmap';
import { loadGoogleMaps, removeGoogleMaps } from '../../config/GoogleMaps';

const GMapDemo = () => {
    const google = window.google;
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState(null);

    const toast = useRef(null);
    const infoWindow = useRef(null);

    useEffect(() => {
        loadGoogleMaps(() => {
            setGoogleMapsReady(true);
            getPOI();    
        });

        return () => {
            removeGoogleMaps();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getPOI = async() => {
        const baseUrl = "https://serv.vsms.co.id/api/livedata/position";

        const result = await axios({
            method:"GET",
            url:baseUrl, 
            headers: {
                'Content-Type': 'application/json',   
                'Authorization': "Bearer eee7f1550915b8e8eb900e98f7659661",
            }
        });

        if (result.status === 200) {
            const resultList = result.data.data;

            for (var key in resultList) {
                const data = resultList[key];

                let newMarker = new google.maps.Marker({
                    position: {
                        lat: data.lat,
                        lng: data.lng
                    },
                    title: data.license_plate
                });

                setOverlays([...overlays, newMarker]);
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const onOverlayClick = (event) => {
        let isMarker = event.overlay.getTitle !== undefined;

        if(isMarker) {
            let title = event.overlay.getTitle();
            infoWindow.current = infoWindow.current||new google.maps.InfoWindow();
            infoWindow.setContent('<div>' + title + '</div>');
            infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());

            toast.current.show({severity:'info', summary:'Marker Selected', detail: title});
        }
        else {
            toast.current.show({severity:'info', summary:'Shape Selected', detail: ''});
        }
    }

    const handleDragEnd = (event) => {
        toast.current.show({severity:'info', summary:'Marker Dragged', detail: event.overlay.getTitle()});
    }
    
    const onMapReady = (event) => {
        // setOverlays(
        //     [
        //         new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),
        //         new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title:"Ataturk Park"}),
        //         new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title:"Oldtown"}),
        //         new google.maps.Polygon({paths: [
        //             {lat: 36.9177, lng: 30.7854},{lat: 36.8851, lng: 30.7802},{lat: 36.8829, lng: 30.8111},{lat: 36.9177, lng: 30.8159}
        //         ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
        //         }),
        //         new google.maps.Circle({center: {lat: 36.90707, lng: 30.56533}, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500}),
        //         new google.maps.Polyline({path: [{lat: 36.86149, lng: 30.63743},{lat: 36.86341, lng: 30.72463}], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2})
        //     ]
        // );
    }

    const options = {
        center: {lat: -6.326233760388557, lng: 106.60337212625095},
        zoom: 12
    };

    return <Fragment>
        {
            googleMapsReady && (
                <div className="card">
                    <GMap overlays={overlays} options={options} style={{width: '100%', minHeight: '320px'}} onMapReady={onMapReady}
                        onOverlayClick={onOverlayClick} onOverlayDragEnd={handleDragEnd} />
                </div>
            )
        }
    </Fragment>
}

export default GMapDemo;