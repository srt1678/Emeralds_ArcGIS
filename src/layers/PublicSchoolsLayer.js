import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const publicSchoolUrl = "https://services2.arcgis.com/I7NQBinfvOmxQbXs/arcgis/rest/services/vw_schools_2023/FeatureServer/0"

const publicSchoolsLayer = new FeatureLayer({
  id: "publicSchoolsLayer",
  url: publicSchoolUrl,
  title: "Public School",
  outFields: ["*"],
  visible: false,
  listMode: "show",
  popupTemplate: {
    title: "{school_name}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {fieldName: "address", label: "Address"},
          {fieldName: "zip", label: "Zip"},
          {fieldName: "mapLabel", label: "mapLabel"},
          {fieldName: "status", label: "Status"},
          {fieldName: "grades", label: "Grades"},
          {fieldName: "esmshs", label: "esmshs"},
        ]
      }
    ]
  }
});

export default publicSchoolsLayer;