import { buildCollection, buildProperty } from "firecms";

interface Ingredient {
    name: string,
    quantity: number,
    measurement: string,
}

interface Step {
    instruction: string,
    image: string
}

export interface Recipe {
    title: string,
    source: string,
    ingredients: Ingredient[],
    steps: Step[]
    isPublished: boolean,
    publishDate: Date,
    lastModifiedDate: Date,
    timeTakenMinutes: number,
}

export const recipeCollection = buildCollection<Recipe>({
    name: "Recipes",
    singularName: "Recipe",
    path: "v1_recipes",
    properties: {
        title: buildProperty ({
            dataType: "string",
            name: "Title",
            validation: {
                required: true,
            },
        }),
        source: buildProperty ({
            dataType: "string",
            name: "Source",
            validation: {
                required: true,
            },
        }),
        ingredients: buildProperty ({
            dataType: "array",
            name: "Ingredients",
            validation: {
                required: true,
                min: 1,
            },
            of: {
                dataType: "map",
                properties: {
                    name: buildProperty({
                        dataType: "string",
                        name: "Name",
                        validation: {
                            required: true,
                        },
                    }),
                    quantity: buildProperty({
                        dataType: "number",
                        name: "Quantity",
                        validation: {
                            required: true,
                        },
                    }),
                    measurement: buildProperty({
                        dataType: "string",
                        name: "Measurement",
                    }),
                }
            }
        }),
        steps: buildProperty ({
            dataType: "array",
            name: "Steps",
            validation: {
                required: true,
                min: 1,
            },
            of: {
                dataType: "string",
                name: "step",
                validation: {
                    required: true,
                },
            }
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
            autoValue: "on_create",
            validation: {
                required: true,
            },
        }),
        lastModifiedDate: buildProperty ({
            dataType: "date",
            name: "Last modified date",
            autoValue: "on_update",
            validation: {
                required: true,
            },
        }),
        timeTakenMinutes: buildProperty ({
            dataType: "number",
            name: "Time taken (minutes)",
            validation: {
                required: true,
            },
        }),
    }
});