export class Car{
    constructor(
         brand,model,type,pricePerDay,image,transmission,
        fuelCapacity,seats,available
    ){
        this.id=crypto.randomUUID()
        this.brand=brand
        this.model=model
        this.type=type
        this.pricePerDay=pricePerDay
        this.image=image
        this.transmission=transmission,
        this.fuelCapacity=fuelCapacity,
        this.seats=seats,
        this.available=available,
         this.createdAt=Date.now()
    }

 getFullName() {
    return `${this.brand} ${this.model}`;
  }


}






//  {
//     "id": "b63a7f80-77cb-4b2a-8cbe-d5b76ff3df99",
//     "brand": "Tesla",
//     "model": "Model S Plaid",
//     "type": "sedan",
//     "pricePerDay": 180,
//     "image": "https://github.com/Gkhundadze/car-rental-car-data/blob/main/images/tesla_model_s_plaid.png?raw=true",
//     "transmission": "Automatic",
//     "fuelCapacity": 120,
//     "seats": 5,
//     "available": true,
//     "featured": true,
//     "createdAt": 1717243200000
//   }