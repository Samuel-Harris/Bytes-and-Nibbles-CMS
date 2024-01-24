import { UploadedFileContext, buildCollection, buildProperty } from "firecms";

interface Paragraph {
    paragraph: string;
}

interface Code {
    language: string;
    code: string;
}

interface CaptionedImage {
    image: string;
    caption: string;
}

interface Section {
    title: string;
    body: (Paragraph | Code | CaptionedImage)[];
}

export interface Byte {
    title: string;
    thumbnail: string;
    coverPhoto: string;
    isPublished: boolean;
    publishDate: Date;
    lastModifiedDate: Date;
    sections: Section[];
}

export const byteCollection = buildCollection<Byte>({
    name: "Bytes",
    singularName: "Byte",
    path: "v1_bytes",
    properties: {
        title: buildProperty ({
            dataType: "string",
            name: "Title",
            validation: {
                required: true,
            },
        }),
        thumbnail: buildProperty({
            dataType: "string",
            name: "Thumbnail",
            storage: {
                storagePath: "images/bytes/thumbnails",
                acceptedFiles: ["image/*"],
                metadata: {
                    cacheControl: "max-age=1000000"
                },
                fileName: (context: UploadedFileContext) => {
                    return context.file.name;
                }
            },
            validation: {
                required: true,
            },
        }),
        coverPhoto: buildProperty({
            dataType: "string",
            name: "Cover photo",
            storage: {
                storagePath: "images/bytes/coverPhotos",
                acceptedFiles: ["image/*"],
                metadata: {
                    cacheControl: "max-age=1000000"
                },
                fileName: (context: UploadedFileContext) => {
                    return context.file.name;
                }
            },
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
                                paragraph: buildProperty({
                                    dataType: "string",
                                    name: "Paragraph",
                                    markdown: true,
                                    multiline: true,
                                    validation: {
                                        required: true,
                                    },
                                }),
                                code: buildProperty({
                                    dataType: "map",
                                    properties: {
                                        caption: buildProperty({
                                            dataType: "string",
                                            name: "Language",
                                            validation: {
                                                required: true,
                                            },
                                        }),
                                        image: buildProperty({
                                            dataType: "string",
                                            name: "Code",
                                            multiline: true,
                                            validation: {
                                                required: true,
                                            },
                                        }),
                                    }
                                }),
                                captionedImage: buildProperty({
                                    dataType: "map",
                                    properties: {
                                        image: buildProperty({
                                            dataType: "string",
                                            name: "Image",
                                            storage: {
                                                storagePath: "images/bytes/bodyImages",
                                                acceptedFiles: ["image/*"],
                                                metadata: {
                                                    cacheControl: "max-age=1000000"
                                                },
                                                fileName: (context: UploadedFileContext) => {
                                                    return context.file.name;
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