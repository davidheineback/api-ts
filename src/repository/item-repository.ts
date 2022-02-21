import { ItemInterface, ItemModel } from '../models/ItemModel'

export async function addItem(item: ItemInterface): Promise<ItemInterface> {
  const newItem= new ItemModel(item)
  const saveItem= (await newItem.save()).populate('owner', '_id')
  return saveItem
}


export async function getAllItemsFrom(userID: string) {
  return await ItemModel.find({ owner: userID })
}

export async function getItemFrom(itemID: string) {
  return await ItemModel.findOne({ _id: itemID })
}

export async function deleteItem(itemID: string, userID: string) {
  return await ItemModel.findOneAndDelete({ _id: itemID, owner: userID })
}

export async function updateItem(itemID: string, item: UpdateItem) {
  return await ItemModel.findOneAndUpdate({ _id: itemID, owner: item.userID }, item)
}

export type UpdateItem = {
  name: string,
  description: string,
  userID: string
}