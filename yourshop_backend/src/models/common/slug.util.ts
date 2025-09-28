import {Model, ModelStatic, Op} from 'sequelize'
import slugify from 'slugify'

export function baseSlug(text: string): string {
    return slugify(text ?? '', {lower: true, strict: true, trim: true})
}

export async function ensureUniqueSlug<T extends Model<any, any>>(
    ModelClass: ModelStatic<T>,
    desired: string,
    field: string = 'slug',
    selfPk?: number | string | null
): Promise<string> {
    let slug = desired
    let counter = 1 

    const notSelf: any = selfPk ? {[Op.ne]: selfPk} : {[Op.ne]: null}

    const exists = async (candidate: string) => {
        const where: any = { [field]: candidate }

        if(selfPk) where.id = notSelf
        
        const count = await (ModelClass as any).count({where})
        return count > 0
    }

    //Checking if slug exists- if it does push counter '-2' to the same slug
    while (await exists(slug)){
        slug = `${desired}-${counter}`
    }
    return slug
}