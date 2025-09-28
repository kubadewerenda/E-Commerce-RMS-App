import {
Table,
Column,
Model,
DataType,
PrimaryKey,
AutoIncrement,
AllowNull,
Unique,
DefaultScope,
Scopes,
BelongsTo,
ForeignKey,
HasMany,
CreatedAt,
UpdatedAt,
BeforeValidate,
} from 'sequelize-typescript';
import { baseSlug, ensureUniqueSlug } from '../common/slug.util';
import { instanceOfStringCategory } from './utils';

@DefaultScope(() => ({ order: [['name', 'ASC']] }))
@Scopes(() => ({
    withChildren: {
        include: [
            { 
                model: Category, 
                as: 'children' 
            }
        ]
    }
}))
@Table({ tableName: 'categories', timestamps: true })
export default class Category extends Model<Category> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @AllowNull(false)
    @Column(DataType.STRING(100))
    name!: string

    @AllowNull(true)
    @Unique(true)
    @Column(DataType.STRING(255))
    slug!: string | null

    @ForeignKey(() => Category)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    parentId!: number | null

    @BelongsTo(() => Category, { as: 'parent', foreignKey: 'parentId', onDelete: 'SET NULL' })
    parent?: Category | null

    @HasMany(() => Category, { as: 'children', foreignKey: 'parentId' })
    children?: Category[] | null

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date

    @BeforeValidate
    static async setSlug(instance: Category){
        if(!instance.name) return
        const desired = baseSlug(instance.name)
        if(!instance.slug || instance.slug !== desired){
            instance.slug = await ensureUniqueSlug(Category, desired, 'slug', instance.id ?? null)
        }
    }

    toString(){
        return instanceOfStringCategory(this)
    }
}
