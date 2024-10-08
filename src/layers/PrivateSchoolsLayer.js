import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const privateSchoolsUrl =
    "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Private_School/FeatureServer/0";

const privateSchoolsLayer = new FeatureLayer({
    id: "privateSchoolsLayer",
    url: privateSchoolsUrl,
    outFields: ["*"],
    visible: false,
    listMode: "show",
    popupTemplate: {
        title: "{NAME}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "SCHOOL_STREET_ADDRESS", label: "Address" },
                    { fieldName: "SCHOOL_CITY", label: "City" },
                    { fieldName: "SCHOOL_STATE", label: "State" },
                    { fieldName: "SCHOOL_ZIP", label: "Zip" },
                    { fieldName: "SCHOOL_COUNTY", label: "County" },
                    { fieldName: "PUBLIC_SCHOOL_DISTRICT", label: "District" },
                    {
                        fieldName: "FOR_PROFIT_OR_NON_PROFIT",
                        label: "For Profit or Non-Profit",
                    },
                ],
            },
        ],
    },
    fields: [
      { name: "OBJECTID", alias: "ObjectID", type: "oid" },
      { name: "NAME", alias: "Name", type: "string" },
      { name: "SCHOOL_STREET_ADDRESS", alias: "Address", type: "string" },
      { name: "SCHOOL_CITY", alias: "City", type: "string" },
      { name: "SCHOOL_STATE", alias: "State", type: "string" },
      { name: "SCHOOL_ZIP", alias: "ZIP", type: "string" }
    ]
});

export default privateSchoolsLayer;
