import Category from "./category.model.js";

export function instanceOfStringCategory(cat: Category){
    const name = cat.name ?? ''
    const parentName = (cat as any)?.parent?.name

    return parentName ? `${parentName} > ${name}` : name
}