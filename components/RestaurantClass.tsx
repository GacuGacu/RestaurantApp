import RestaurantData from '../components/RestaurantData';

//Defining the class and initializing the constructor for it
class Restaurant {
  businessStatus: string; 
  geometry: any;
  icon: string;
  iconBackgroundColor: string; 
  iconMaskBaseUri: string; 
  name: string;
  openingHours: any; 
  photos: any[]; 
  placeId: string; 
  plusCode: any;
  priceLevel: number;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  userRatingsTotal: number;
  vicinity: string;
  index: number; // Add index property

  constructor(data: RestaurantData,index: number ) {
    this.businessStatus = data.business_status;
    this.geometry = data.geometry;
    this.icon = data.icon;
    this.iconBackgroundColor = data.icon_background_color;
    this.iconMaskBaseUri = data.icon_mask_base_uri;
    this.name = data.name;
    this.openingHours = data.opening_hours;
    this.photos = data.photos;
    this.placeId = data.place_id;
    this.plusCode = data.plus_code;
    this.priceLevel = data.price_level;
    this.rating = data.rating;
    this.reference = data.reference;
    this.scope = data.scope;
    this.types = data.types;
    this.userRatingsTotal = data.user_ratings_total;
    this.vicinity = data.vicinity;
    this.index = index;

  }

  getPhotoUrl(width: number, height: number, photoReference: string): string {
    const baseUrl = 'Google maps API key';
    const apiKey = 'APIKEY'; // DELETE API KEY
    return `${baseUrl}?maxwidth=${width}&maxheight=${height}&photoreference=${photoReference}&key=${apiKey}`;
  }
}

export default Restaurant;
  