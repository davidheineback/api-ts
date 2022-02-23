import { AuctionInterface, AuctionModel } from '../models/AuctionModel'

export async function addAuction(auction: AuctionInterface): Promise<AuctionInterface> {
  const newAuction= new AuctionModel(auction)
  const saveAuction= await newAuction.save()
  return saveAuction
}

export async function getActiveAuctions() {
  const activeAuctions = await AuctionModel.find({})
  return activeAuctions
}

