let map;
let marker = new Map();
let veicoli_istante = [];
let element = 0, jump = 0, flotta = 0;
let svgMacchine, svgVeicolo;
let current_vehicle, myLatlng, locationIcon, temp;
let playButton;
//array di tutti i veicoli preso dall'html
let veicoli = $("#veicoli").data('my-object');
var geocoder;
let selected = -1;
let loop, scale;
let refresh = 1000;
let infowindow = null;
let dropdownContent, dropdownContent2;

let evento = 0;

//array dei veicoli delle flotta
let vehicles_id = ['1', '2', '4', '5', '12'];

// menu laterale sx, vista della flotta
function Menu() {
    const div1 = document.createElement("div");
    const divClose = document.createElement("div");
    divClose.style.display = "flex";
    divClose.style.alignItems = "center";
    divClose.style.paddingBottom = "15px";
    div1.id = "mySidepanel";
    div1.className = "sidepanel";
    const a1 = document.createElement("a");
    a1.href = "javascript:void(0)";
    a1.className = "closebtn";
    a1.onclick = function closeNav() {
        document.getElementById("mySidepanel").style.width = "0";
        document.getElementById("mySidepanel").style.border = "transparent";
        document.getElementById("divButtons").style.marginLeft = "0";
    }
    a1.textContent = "×";
    const l1 = document.createElement("label");
    l1.textContent = "Flotta";
    l1.style.width = "40%";
    l1.style.fontSize = "26px";
    l1.style.margin = "0";
    l1.style.paddingLeft = "32px";
    divClose.append(l1);
    divClose.append(a1);
    div1.append(divClose);
    for (let i = 0; i < vehicles_id.length; i++) {
        const a2 = document.createElement("a");
        a2.textContent = "Veicolo" + vehicles_id[i];
        a2.style.cursor = "pointer";
        a2.style.backgroundColor = "#fcfcfc";
        div1.append(a2);
        const div3 = document.createElement("div");
        div3.className = "dropdown-container";
        const divVelocita = document.createElement("div");
        divVelocita.style.display = "flex";
        divVelocita.style.paddingBottom = "10px";
        const l = document.createElement("label");
        l.textContent = "Velocità: ";
        l.style.width = "40%";
        l.style.fontSize = "16px";
        l.style.margin = "0";
        const a = document.createElement("a");
        a.textContent = "0.00 km/h";
        a.id = "li" + vehicles_id[i];
        a.style.width = "50%";
        a.style.padding = "0";

        divVelocita.append(l);
        divVelocita.append(a);

        //divVelocita.style.backgroundColor = "#DCDCDC";
        divVelocita.style.fontFamily = "Roboto, Arial, sans-serif";
        divVelocita.style.paddingBottom = "5px";
        divVelocita.style.borderBottom = "0.5px solid #000000";
        divVelocita.style.paddingTop = "5px";
        divVelocita.style.borderTop = "0.5px solid #000000";
        div3.append(divVelocita);
        //div3.style.display = "flex";
        div3.style.alignItems = "center";
        div3.style.marginLeft = "40px";
        //div1.append(div3);


        const aModello = document.createElement("a");
        aModello.textContent = 'Modello:    FIAT Ducato';
        aModello.id = vehicles_id[i];
        aModello.style.width = "100%";
        aModello.style.padding = "0";
        aModello.style.whiteSpace = "pre-wrap";
        aModello.style.marginBottom = "0";
        aModello.style.paddingTop = "5px";
        aModello.style.paddingBottom = "5px";
        aModello.style.borderBottom = "0.5px solid #000000";


        div3.append(aModello);
        div3.style.marginRight = "20px";
        const aTarga = document.createElement("a");
        let targa = new RandExp(/[A-Z][A-Z][0-9][0-9][0-9][A-Z][A-Z]/).gen();
        aTarga.textContent = "Targa:        " + targa;
        aTarga.id = vehicles_id[i];
        aTarga.style.width = "100%";
        aTarga.style.padding = "0";
        aTarga.style.whiteSpace = "pre-wrap";
        aTarga.style.paddingTop = "5px";
        aTarga.style.paddingBottom = "5px";
        aTarga.style.borderBottom = "0.5px solid #000000";

        div3.append(aTarga);
        div1.append(div3);

        a2.addEventListener("click", () => {
            a2.classList.toggle("active");
            if (dropdownContent) {
                dropdownContent.style.display = "none";
            }
            dropdownContent2 = a2.nextElementSibling;
            if (dropdownContent2.style.display === "inherit") {
                dropdownContent2.style.display = "none";
                if (infowindow)
                    infowindow.close();
            } else {
                //if (dropdownContent2 !== dropdownContent) {
                dropdownContent2.style.display = "inherit";
                if (infowindow)
                    infowindow.close();
                infowindow = new google.maps.InfoWindow({
                    content: a2.textContent
                });
                infowindow.open(map, marker.get(a2.textContent.substring(7)));
                //}
            }
            dropdownContent = dropdownContent2;
        });
    }

    const button = document.createElement("button");
    button.className = "openbtn";
    button.onclick = function openNav() {
        document.getElementById("mySidepanel").style.width = "20%";
        document.getElementById("mySidepanel").style.border = "2px solid #fff";
        //document.getElementById("divButtons").style.marginLeft = "10px";
    }
    button.textContent = "☰";
    button.style.fontSize = "22px";
    button.style.paddingLeft = "10px";
    button.style.marginTop = "10px";

    const div2 = document.createElement("div");
    div2.append(div1);
    div2.append(button);
    return div2;
}

// bottone flotta/visione completa
function createFlottaControl() {
    const flottaButton = document.createElement("button");


    flottaButton.id = "controlButton";

    // Set CSS for the control.
    flottaButton.textContent = "Isola flotta";
    flottaButton.title = "Click to recenter the map";
    flottaButton.type = "checkbox";

    // Setup the click event listeners: simply set the map to Chicago.
    flottaButton.addEventListener("click", () => {
        if (playButton.textContent === "⏸") {
            if (flottaButton.textContent === "Isola flotta") {
                flotta = 1;
                flottaButton.textContent = "Visualizza traffico";
            } else {
                flotta = 0;
                flottaButton.textContent = "Isola flotta";
            }
        } else {
            if (flottaButton.textContent === "Isola flotta") {
                flotta = 1;
                flottaButton.textContent = "Visualizza traffico";
                for (let j = 0; j < veicoli_istante.length; j++) {
                    current_vehicle = veicoli_istante[j];
                    if (!(veicoli_istante[j].vehicle_id !== "" && vehicles_id.includes(veicoli_istante[j].vehicle_id))) {
                        if (veicoli_istante[j].vehicle_id !== "" && marker.has(current_vehicle.vehicle_id)) {
                            marker.get(current_vehicle.vehicle_id).setVisible(false);
                        }
                    }
                }
            } else {
                flotta = 0;
                flottaButton.textContent = "Isola flotta";
                for (let j = 0; j < veicoli_istante.length; j++) {
                    current_vehicle = veicoli_istante[j];
                    if (!(veicoli_istante[j].vehicle_id !== "" && vehicles_id.includes(veicoli_istante[j].vehicle_id))) {
                        if (veicoli_istante[j].vehicle_id !== "" && marker.has(current_vehicle.vehicle_id)) {
                            myLatlng = new google.maps.LatLng(current_vehicle.lat, current_vehicle.lng);
                            marker.get(current_vehicle.vehicle_id).setVisible(true);
                        }
                    }
                }
            }

        }
    });

    return flottaButton;
}

// bottone play/pausa
function createPlayControl() {
    playButton = document.createElement("button");

    playButton.id = "controlButton";

    // Set CSS for the control.
    playButton.textContent = "⏵";
    playButton.title = "Click to run the simulation";
    playButton.type = "button";
    playButton.style.fontSize = "16px";
    playButton.style.textAlign = "center";
    playButton.style.paddingLeft = "10px";
    playButton.addEventListener("click", () => {
        if (playButton.textContent === "⏸") {
            clearTimeout(loop);
            playButton.textContent = "⏵";
        } else {
            playButton.textContent = "⏸";
            SetMarkers();
        }

    });

    return playButton;
}

// bottone restart
function createRestartControl() {
    const restartButton = document.createElement("button");

    restartButton.id = "controlButton";

    restartButton.textContent = "Restart";
    restartButton.title = "Click to restart the simulation";
    restartButton.type = "button";

    restartButton.addEventListener("click", () => {
        veicoli_istante = [];
        marker.clear();
        element = 0;
        jump = 0;
        clearTimeout(loop);
        refresh = 1000;
        initMap();
    });

    return restartButton;
}

// bottone restart
function createEventoCriticoControl() {
    const eventButton = document.createElement("button");

    eventButton.id = "controlButton";

    eventButton.textContent = "Play Evento Critico";
    eventButton.title = "Click to restart the simulation with crtiticism";
    eventButton.type = "button";

    eventButton.addEventListener("click", () => {
        if (eventButton.textContent === "Stop Evento Critico") {
            clearTimeout(loop);
            eventButton.textContent = "Play Evento Critico";
        } else {
            eventButton.textContent = "Stop Evento Critico";
            SetMarkersEvent();
        }
        //initMap();
    });

    return eventButton;
}

// bottone velocità
function createRefreshControl() {


    const refreshButton = document.createElement("select");


    var option = document.createElement("option");
    var option1 = document.createElement("option");
    var option2 = document.createElement("option");
    var option3 = document.createElement("option");
    var option4 = document.createElement("option");

    option.text = "Velocità 0.25x";
    option.value = "0";
    option1.text = "Velocità 0.5x";
    option1.value = "1";
    option2.text = "Velocità 1x";
    option2.value = "2";
    option2.selected = true;
    option3.text = "Velocità 1.5x";
    option3.value = "3";
    option4.text = "Velocità 2x";
    option4.value = "4";
    refreshButton.id = "select";
    refreshButton.className = "select";

    // Set CSS for the control.
    refreshButton.appendChild(option);
    refreshButton.appendChild(option1);
    refreshButton.appendChild(option2);
    refreshButton.appendChild(option3);
    refreshButton.appendChild(option4);

    // Setup the click event listeners: simply set the map to Chicago.

    refreshButton.addEventListener("change", () => {
        switch (refreshButton.value) {
            case '0':
                refresh = 2000;
                break;
            case '1':
                refresh = 1500;
                break;
            case '2':
                refresh = 1000;
                break;
            case '3':
                refresh = 500;
                break;
            case '4':
                refresh = 250;
                break;
        }

    });

    return refreshButton;
}

// bottone campionamento
function createStepControl() {


    const stepButton = document.createElement("select");


    let option = document.createElement("option");
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option.text = "Campionamento 100ms";
    option.value = "0";
    option.selected = true;
    option1.text = "Campionamento 500ms";
    option1.value = "1";
    option2.text = "Campionamento 1s";
    option2.value = "2";
    stepButton.id = "select";
    stepButton.className = "select";

    // Set CSS for the control.
    stepButton.appendChild(option);
    stepButton.appendChild(option1);
    stepButton.appendChild(option2);

    // Setup the click event listeners: simply set the map to Chicago.

    stepButton.addEventListener("change", () => {
        switch (stepButton.value) {
            case '0':
                jump = 0;
                break;
            case '1':
                jump = 5;
                break;
            case '2':
                jump = 10;
                break;
            default:
                jump = 0;
                break;
        }

    });

    return stepButton;
}

// inizalizzazione mappa
function initMap() {
    //map
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 42.366830, lng: 13.351510},
        zoom: 16,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        tilt: 0,
        rotateControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_LEFT,
        },
    });
    // DIV that contains all the custom controls
    const divButtons = document.createElement("div");


    // DIV used to separate buttons
    const divideBlock = document.createElement("div");
    divideBlock.id = "divider";

    const divideBlock2 = document.createElement("div");
    divideBlock2.id = "divider";

    const divideBlock3 = document.createElement("div");
    divideBlock3.id = "divider";

    const divideBlock4 = document.createElement("div");
    divideBlock4.id = "divider";

    const divideBlock5 = document.createElement("div");
    divideBlock5.id = "divider";

    // create flotta button
    const centerControl = createFlottaControl();
    // create the play button
    const playButton = createPlayControl();
    // create the reset button
    const restartButton = createRestartControl();


    const refreshButton = createRefreshControl();

    const stepButton = createStepControl();

    const eventButton = createEventoCriticoControl();

    // Append all the controls to the div
    divButtons.appendChild(refreshButton);
    divButtons.appendChild(divideBlock3);
    divButtons.appendChild(centerControl);
    divButtons.appendChild(divideBlock);
    divButtons.appendChild(playButton);
    divButtons.appendChild(divideBlock2);
    divButtons.appendChild(restartButton);
    divButtons.appendChild(divideBlock4);
    divButtons.appendChild(stepButton);
    divButtons.appendChild(divideBlock5);
    divButtons.appendChild(eventButton);
    divButtons.style.width = "64%";
    divButtons.id = "divButtons";
    divButtons.style.marginTop = "0.5%";
    divButtons.style.paddingLeft = "30px";

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divButtons);

    const menu = Menu();

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(menu);

    //svg marker macchine
    svgMacchine = {
        //path: "M 26.65625 0.746094 C 12.171875 2.535156 12.019531 2.683594 9.480469 13.125 C 5.226562 30.652344 4.851562 35.875 6.273438 58.921875 C 7.464844 77.789062 7.839844 100.761719 7.019531 101.582031 C 6.792969 101.804688 5.449219 101.730469 3.957031 101.285156 C 0.894531 100.464844 -0.148438 101.285156 0.148438 104.417969 C 0.296875 105.832031 1.269531 106.730469 3.957031 108.070312 L 7.464844 109.785156 L 7.464844 118.886719 C 7.464844 124.851562 7.09375 128.953125 6.347656 130.894531 C 4.929688 134.847656 4.929688 147.453125 6.347656 153.566406 C 7.914062 160.054688 10.675781 164.828125 15.457031 169.378906 C 22.324219 175.867188 31.730469 179 44.425781 179 C 57.117188 179 66.527344 175.867188 73.394531 169.378906 C 78.171875 164.828125 80.9375 160.054688 82.503906 153.566406 C 83.921875 147.453125 83.921875 134.847656 82.503906 130.894531 C 81.757812 128.953125 81.382812 124.851562 81.382812 118.886719 L 81.382812 109.785156 L 84.894531 108.070312 C 87.582031 106.730469 88.550781 105.832031 88.703125 104.417969 C 89 101.285156 87.953125 100.464844 84.894531 101.285156 C 83.398438 101.730469 82.054688 101.804688 81.832031 101.582031 C 81.011719 100.761719 81.382812 77.789062 82.578125 58.921875 C 83.847656 38.113281 83.625 33.859375 80.9375 20.511719 C 77.578125 3.730469 77.128906 3.058594 67.945312 1.492188 C 61.820312 0.371094 33.375 -0.0742188 26.65625 0.746094 Z M 63.464844 2.238281 C 66.972656 2.683594 71.15625 3.503906 72.871094 4.101562 C 75.859375 5.222656 76.007812 5.445312 77.5 11.039062 C 82.132812 28.042969 82.132812 28.863281 81.011719 77.492188 C 80.414062 103.148438 80.488281 103.820312 81.832031 103.445312 C 86.910156 101.878906 87.355469 101.957031 87.355469 103.894531 C 87.355469 105.460938 86.761719 105.984375 83.921875 107.101562 L 80.5625 108.371094 L 80.9375 120.003906 C 81.160156 126.417969 81.609375 135.441406 81.832031 140.066406 C 82.28125 149.839844 81.457031 154.6875 78.324219 161.027344 C 76.230469 165.203125 75.933594 165.425781 72.871094 165.875 C 68.46875 166.542969 64.734375 169.15625 63.839844 172.136719 C 62.71875 175.941406 58.238281 177.136719 44.425781 177.136719 C 30.613281 177.136719 26.132812 175.941406 25.011719 172.136719 C 24.117188 169.15625 20.382812 166.542969 15.976562 165.875 C 12.917969 165.425781 12.617188 165.203125 10.527344 161.027344 C 7.390625 154.6875 6.570312 149.839844 7.019531 140.066406 C 7.242188 135.441406 7.691406 126.417969 7.914062 120.003906 L 8.289062 108.371094 L 4.929688 107.101562 C 2.089844 105.984375 1.492188 105.460938 1.492188 103.894531 C 1.492188 101.957031 1.941406 101.878906 7.019531 103.445312 C 8.363281 103.820312 8.4375 103.148438 7.839844 77.492188 C 6.71875 29.460938 6.792969 27.894531 11.347656 11.039062 C 12.84375 5.445312 12.992188 5.222656 15.976562 4.101562 C 17.695312 3.503906 21.429688 2.683594 24.265625 2.3125 C 31.730469 1.417969 56 1.34375 63.464844 2.238281 Z M 63.464844 2.238281 ",
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        //url: "/static/js/SimpleYellowCarTopView.svg",
        //scaledSize: new google.maps.Size(1, 1),
        scale: 2,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 0,
    };

    svgVeicolo = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 2,
        fillColor: "yellow",
        fillOpacity: 1,
        strokeWeight: 0,
    };
    /*
    var infowindow = new google.maps.InfoWindow({
        content: markers[0].vehicle_id,
    });

    infowindow.open(map, marker);
*/
    /*
        for (let i = 0; i < vehicles; i++) {
            google.maps.event.addListener(marker[i], 'click', function () {
                selected = i;
                map.setZoom(18);
                if (infowindow)
                    infowindow.close();
                infowindow = new google.maps.InfoWindow({
                    content: marker[i].title,
                });

                infowindow.open(map, marker[i]);
            });
        }
        google.maps.event.addListener(map, 'drag', RemoveFocus);

     */
    google.maps.event.addListener(map, 'zoom_changed', function () {

        marker.forEach((value, key) => {
            value.icon.scale = map.getZoom() - 14;
            console.log(value.icon.scale);
        });
        /*
       scale = map.getZoom() - 14;
       for (let i = 0; i < vehicles; i++) {
           var cur = marker[i].get('icon');
           cur.scale = scale;
           marker[i].set('icon', cur);
       }/*
           var cur = marker.get('icon');
           cur.scale = scale;
           marker.set('icon', cur);
           var cur2 = marker2.get('icon');
           cur2.scale = scale;
           marker2.set('icon', cur2);
           var cur3 = marker3.get('icon');
           cur3.scale = scale;
           marker3.set('icon', cur3);
           */
    });

    /* google.maps.event.addListener(marker, 'click', function () {
         selected = 1;
     });
 */

    //SetMarker2();


}

window.initMap = initMap;


export {};


function RemoveFocus() {
    selected = -1;
}


// funzione che setta i marker, looppa in base al valore della variabile refresh, salva il timeout in loop
function SetMarkers() {
    if (jump > 0) {
        for (let x = 0; x < jump; x++) {
            element++;
            while (veicoli[element].timestep_time === "") {
                element++;
            }
        }
    }
    if (!veicoli_istante.includes(veicoli[element])) {
        veicoli_istante.push(veicoli[element]);
    }
    element++;
    while (veicoli[element].timestep_time === "") {
        if (!veicoli_istante.includes(veicoli[element])) {
            veicoli_istante.push(veicoli[element]);
        }
        element++;
    }
    if (flotta === 0) {
        for (let j = 0; j < veicoli_istante.length; j++) {
            if (veicoli_istante[j].vehicle_id !== "") {
                current_vehicle = veicoli_istante[j];
                myLatlng = new google.maps.LatLng(current_vehicle.lat, current_vehicle.lng);
                if (marker.has(current_vehicle.vehicle_id)) {

                    temp = marker.get(current_vehicle.vehicle_id);
                    locationIcon = temp.get('icon');
                    locationIcon.rotation = current_vehicle.vehicle_angle;
                    temp.set('icon', locationIcon);
                    temp.setPosition(myLatlng);
                    marker.get(current_vehicle.vehicle_id).set(temp);
                    if (marker.get(current_vehicle.vehicle_id).visible === false) {
                        marker.get(current_vehicle.vehicle_id).setVisible(true);
                    }
                    if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                        const span = document.getElementById("li" + current_vehicle.vehicle_id);
                        span.textContent = current_vehicle.vehicle_speed + " km/h";
                    }


                } else {
                    if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgVeicolo,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    } else {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgMacchine,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    }
                }
            }
        }
    } else {
        for (let j = 0; j < veicoli_istante.length; j++) {
            current_vehicle = veicoli_istante[j];
            if (veicoli_istante[j].vehicle_id !== "" && vehicles_id.includes(veicoli_istante[j].vehicle_id)) {
                myLatlng = new google.maps.LatLng(current_vehicle.lat, current_vehicle.lng);
                if (marker.has(current_vehicle.vehicle_id)) {
                    temp = marker.get(current_vehicle.vehicle_id);
                    locationIcon = temp.get('icon');
                    locationIcon.rotation = current_vehicle.vehicle_angle;
                    temp.set('icon', locationIcon);
                    temp.setPosition(myLatlng);
                    marker.get(current_vehicle.vehicle_id).set(temp);
                } else {
                    if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgVeicolo,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    }
                }
            } else {
                if (veicoli_istante[j].vehicle_id !== "" && marker.has(current_vehicle.vehicle_id)) {
                    marker.get(current_vehicle.vehicle_id).setVisible(false);
                }
            }
        }
    }

    loop = setTimeout(SetMarkers, refresh);

}

function SetMarkersEvent() {
    if (jump > 0) {
        for (let x = 0; x < jump; x++) {
            element++;
            while (veicoli[element].timestep_time === "") {
                element++;
            }
        }
    }
    if (!veicoli_istante.includes(veicoli[element])) {
        veicoli_istante.push(veicoli[element]);
    }
    if (veicoli[element].evento_critico === "true") {
        evento = 1;
    }
    element++;
    while (veicoli[element].timestep_time === "") {
        if (!veicoli_istante.includes(veicoli[element])) {
            veicoli_istante.push(veicoli[element]);
        }
        element++;
    }
    if (flotta === 0) {
        for (let j = 0; j < veicoli_istante.length; j++) {
            if (veicoli_istante[j].vehicle_id !== "") {
                current_vehicle = veicoli_istante[j];
                myLatlng = new google.maps.LatLng(current_vehicle.lat, current_vehicle.lng);
                if (marker.has(current_vehicle.vehicle_id)) {
                    if (evento === 1 && current_vehicle.vehicle_id === "2") {
                        if (infowindow)
                            infowindow.close();
                        infowindow = new google.maps.InfoWindow({
                            content: "Veicolo: " + current_vehicle.vehicle_id + '<br>' +
                                " evento critico: veicolo fermo in strada"
                        });
                        infowindow.open(map, marker.get(current_vehicle.vehicle_id));

                        evento = 0;
                    } else {
                        temp = marker.get(current_vehicle.vehicle_id);
                        locationIcon = temp.get('icon');
                        locationIcon.rotation = current_vehicle.vehicle_angle;
                        temp.set('icon', locationIcon);
                        temp.setPosition(myLatlng);
                        marker.get(current_vehicle.vehicle_id).set(temp);
                        if (marker.get(current_vehicle.vehicle_id).visible === false) {
                            marker.get(current_vehicle.vehicle_id).setVisible(true);
                        }
                        if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                            const span = document.getElementById("li" + current_vehicle.vehicle_id);
                            span.textContent = current_vehicle.vehicle_speed + " km/h";
                        }
                    }

                } else {
                    if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgVeicolo,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    } else {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgMacchine,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    }
                }
            }
        }
    } else {
        for (let j = 0; j < veicoli_istante.length; j++) {
            current_vehicle = veicoli_istante[j];
            if (veicoli_istante[j].vehicle_id !== "" && vehicles_id.includes(veicoli_istante[j].vehicle_id)) {
                myLatlng = new google.maps.LatLng(current_vehicle.lat, current_vehicle.lng);
                if (marker.has(current_vehicle.vehicle_id)) {
                    temp = marker.get(current_vehicle.vehicle_id);
                    locationIcon = temp.get('icon');
                    locationIcon.rotation = current_vehicle.vehicle_angle;
                    temp.set('icon', locationIcon);
                    temp.setPosition(myLatlng);
                    marker.get(current_vehicle.vehicle_id).set(temp);
                } else {
                    if (vehicles_id.includes(current_vehicle.vehicle_id)) {
                        marker.set(current_vehicle.vehicle_id, new google.maps.Marker({
                            map: map,
                            position: myLatlng,
                            icon: svgVeicolo,
                            title: current_vehicle.vehicle_id,
                            rotation: current_vehicle.vehicle_angle,
                        }));
                    }
                }
            } else {
                if (veicoli_istante[j].vehicle_id !== "" && marker.has(current_vehicle.vehicle_id)) {
                    marker.get(current_vehicle.vehicle_id).setVisible(false);
                }
            }
        }
    }

    loop = setTimeout(SetMarkersEvent, refresh);

}

$(document).ready(function () {

})



