import { ItemInterface, ItemModel } from '../models/ItemModel'

export async function addItem(item: ItemInterface): Promise<ItemInterface> {
  const newItem= new ItemModel(item)
  const saveItem= (await newItem.save()).populate('owner', '_id')
  return saveItem
}
