import { buildCollection, buildProperty } from "firecms";

export interface ByteSeries {
  title: string;
  accentColour: string;
}

export const byteSeriesCollection = buildCollection<ByteSeries>({
  name: "Byte series",
  singularName: "Byte series",
  path: "v1_byte_series",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title",
      validation: {
        required: true,
        unique: true,
      },
    }),
    accentColour: buildProperty({
      dataType: "string",
      name: "Accent hexadecimal colour",
      validation: {
        required: true,
        matches: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
      },
    }),
  },
});
