import { buildCollection, buildProperty } from "firecms";

interface TechBlogEntryParagraph {
    type: "text";
    value: string;
}

interface CaptionedImage {
    image: string;
    caption: string;
}

interface TechBlogEntrySection {
    title: string;
    body: (TechBlogEntryParagraph | CaptionedImage)[];
}

export interface TechBlogEntry {
    title: string;
    isPublished: boolean;
    publishDate: Date;
    lastModifiedDate: Date;
    sections: TechBlogEntrySection[];
}

export const techBlogCollection = buildCollection<TechBlogEntry>({
    name: "Tech blogs",
    singularName: "Tech blog entry",
    path: "tech_blogs",
    permissions: ({ authController }) => ({
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        title: buildProperty ({
            dataType: "string",
            name: "Title",
            validation: {
                required: true,
            },
        }),
        isPublished: buildProperty ({
            dataType: "boolean",
            name: "Is published?",
            validation: {
                required: true,
            },
        }),
        publishDate: buildProperty ({
            dataType: "date",
            name: "Publish date",
            autoValue: "on_create"
        }),
        lastModifiedDate: buildProperty ({
            dataType: "date",
            name: "Last modified date",
            autoValue: "on_update"
        }),
        sections: buildProperty ({
            dataType: "array",
            name: "Sections",
            validation: {
                required: true,
                min: 1,
            },
            of: {
                dataType: "map",
                properties: {
                    title: buildProperty({
                        dataType: "string",
                        name: "Heading",
                        validation: {
                            required: true
                        },
                    }),
                    body: buildProperty({
                        dataType: "array",
                        name: "Body",
                        validation: {
                            required: true
                        },
                        oneOf: {
                            typeField: "type",
                            valueField: "value",
                            properties: {
                                text: buildProperty({
                                    dataType: "string",
                                    name: "Text",
                                    markdown: true,
                                }),
                                captionedImage: buildProperty({
                                    dataType: "map",
                                    properties: {
                                        image: buildProperty({
                                            dataType: "string",
                                            name: "Image",
                                            storage: {
                                                storagePath: "images",
                                                acceptedFiles: ["image/*"],
                                                metadata: {
                                                    cacheControl: "max-age=1000000"
                                                }
                                            },
                                            validation: {
                                                required: true,
                                            },
                                        }),
                                        caption: buildProperty({
                                            dataType: "string",
                                            name: "Caption",
                                            markdown: true,
                                            validation: {
                                                required: true,
                                            },
                                        }),
                                    }
                                }),
                            }
                        }
                    }),
                }, 
            }
        }),
    }
});