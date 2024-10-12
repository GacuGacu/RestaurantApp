
interface RestaurantData {
    business_status: string;
    geometry: any;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: any; 
    photos: any[]; 
    place_id: string;
    plus_code: any; 
    price_level: number;
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
    
  }
  
  export default RestaurantData;

  // In this file we define the type of argument data for the constructor of class Restaurant
  