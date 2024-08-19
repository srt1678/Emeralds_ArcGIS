import React, { useEffect, useRef, useState, useCallback } from "react";
import "./LegendComponent.css";
import { FaListUl } from "react-icons/fa6";
import Legend from "@arcgis/core/widgets/Legend.js";

const LegendComponent = ({ toggleLegend, isLegendVisible, view, clearTrigger }) => {
    // Ref for the Legend widget
    const legendRef = useRef(null);
    // State to store the current layer's note
    const [currentLayerNote, setCurrentLayerNote] = useState("");

    // Function to shorten URLs for display
    const shortenUrl = useCallback((url) => {
        try {
            const urlObj = new URL(url);
            return `${urlObj.hostname}/...${urlObj.pathname.slice(-20)}`;
        } catch (e) {
            // If it's not a valid URL, return the original text
            return url;
        }
    }, []);

    // Function to format the note, determining if it's a URL or plain text
    const formatNote = useCallback((note) => {
        if (note.startsWith('http://') || note.startsWith('https://')) {
            return { isUrl: true, text: `More info: ${shortenUrl(note)}`, fullUrl: note };
        } else {
            return { isUrl: false, text: note };
        }
    }, [shortenUrl]);

    // Function to update the current layer information
    const updateCurrentLayerInfo = useCallback(() => {
        if (view && view.map && view.map.allLayers) {
            const visibleLayers = view.map.allLayers.filter(layer => layer && layer.visible);
            
            if (visibleLayers.length > 0) {
                const operationalLayer = visibleLayers.find(layer => layer.type !== "vector-tile");
                if (operationalLayer && operationalLayer.note) {
                    setCurrentLayerNote(operationalLayer.note);
                } else {
                    setCurrentLayerNote("");
                }
            } else {
                setCurrentLayerNote("");
            }
        } else {
            setCurrentLayerNote("");
        }
    }, [view]);

    // Effect to initialize the Legend widget and set up layer watchers
    useEffect(() => {
        if (view && !legendRef.current) {
            legendRef.current = new Legend({
                view: view,
                container: document.createElement("div"),
            });

            updateCurrentLayerInfo();

            const layerWatchers = [];

            if (view.map && view.map.allLayers) {
                view.map.allLayers.forEach(layer => {
                    if (layer) {
                        const watcher = layer.watch("visible", updateCurrentLayerInfo);
                        layerWatchers.push({ layer, watcher });
                    }
                });
            }

            // Cleanup function
            return () => {
                layerWatchers.forEach(({ layer, watcher }) => {
                    if (layer && layer.removeWatch) {
                        layer.removeWatch(watcher);
                    }
                });
                if (view && legendRef.current) {
                    view.ui.remove(legendRef.current);
                }
            };
        }
    }, [view, updateCurrentLayerInfo]);

    // Effect to update layer info when clearTrigger changes
    useEffect(() => {
        updateCurrentLayerInfo();
    }, [clearTrigger, updateCurrentLayerInfo]);

    // Effect to update the legend UI and handle visibility
    useEffect(() => {
        if (legendRef.current && legendRef.current.container) {
            const existingCustomText = legendRef.current.container.querySelector(".legend-layer-info");
            if (existingCustomText) {
                existingCustomText.remove();
            }

            if (currentLayerNote) {
                const customTextDiv = document.createElement("div");
                customTextDiv.className = "legend-layer-info";
                
                const formattedNote = formatNote(currentLayerNote);
                
                if (formattedNote.isUrl) {
                    const linkElement = document.createElement("a");
                    linkElement.href = formattedNote.fullUrl;
                    linkElement.target = "_blank";
                    linkElement.rel = "noopener noreferrer";
                    linkElement.textContent = formattedNote.text;
                    // Ensure the link opens in a new tab
                    linkElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.open(formattedNote.fullUrl, '_blank');
                    });
                    customTextDiv.appendChild(linkElement);
                } else {
                    customTextDiv.textContent = formattedNote.text;
                }

                legendRef.current.container.insertBefore(
                    customTextDiv,
                    legendRef.current.container.firstChild
                );
            }
        }

        // Add or remove the legend from the UI based on visibility
        if (isLegendVisible && view && legendRef.current) {
            view.ui.add(legendRef.current, "bottom-right");
        } else if (view && legendRef.current) {
            view.ui.remove(legendRef.current);
        }
    }, [isLegendVisible, view, currentLayerNote, formatNote]);

    // Render the toggle button for the legend
    return (
        <button className="legend-toggle-button" onClick={toggleLegend}>
            <FaListUl className="legend-toggle-icon" />
        </button>
    );
};

export default LegendComponent;
