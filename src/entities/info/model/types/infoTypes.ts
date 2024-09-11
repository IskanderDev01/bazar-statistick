import { IParams } from '@/shared/types/types'

export interface CarEntry {
    date: string;       
    car_number: string; 
    first_time: string; 
    first_image: string;
    last_time: string;  
    last_image: string; 
}

export interface InfoSchema extends IParams{
}