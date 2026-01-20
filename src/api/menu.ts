import axios from 'axios'

import type { MenuDataType, SyncMenuDataType } from './interface/menuIterface'
import { ENDPOINTS } from './vars/vars'
import { GET, GETBYID, PATCH, POST, DELETE } from './api'
import toast from "react-hot-toast"

export async function getAllMenues(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching menus data')
    }
  }
}


export async function getAllMenuesByBusinessId(
  businessId: string, 
  page?: number, 
  itemsPerPage?: number, 
  searchTerm?: string
): Promise<any> {
  try {
    let pp_default = 9;
    if (itemsPerPage) {
      pp_default = itemsPerPage;
    }
    
    let url = `${ENDPOINTS.products}/by-business/${businessId}/${pp_default}`;
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
      params.append('search', searchTerm.trim());
    }
    
    // Append query string if we have any parameters
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await GET(url);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    } else {
      throw new Error('Error in fetching menus data');
    }
  }
}



export async function deleteMenuFlowAndTemplateBymetaId(metaId : string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/delete-item/${metaId}/`
    const response = await GET(url)

    return response.data
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching menus data')
    }
  }
}



export async function createMenu(data: MenuDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Menu')
    }
  }
}

export async function createFlow(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.createFlow}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating flow')
    }
  }
}

export async function createTemplate(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.createTemplate}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Template')
    }
  }
}

export async function deleteMenu(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order data')
    }
  }
}
export async function getMenuById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order data')
    }
  }
}
export async function updateMenu(id: number, data: MenuDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.menus}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in updating Menu data')
    }
  }
}
export async function syncMenuData(businessId: string, category='Shopify-Ecommerce', cmd?:string): Promise<any> {
  try {
    
    console.log('category',category)
    let url = ''
    
    if(category== 'Food' && !cmd){  
        url = `products/menu/sync-menu/` // This should point to 'save-changes/'
    }else{
      url = `whatseat/${ENDPOINTS.syncMenuMeta}/`
    }
    console.log('hit api ur',url)
    
    
    const data:any = {
      business_id: businessId,
      category:category
      
    }

    if (cmd) {
       toast.success("🗑️ Deleting Meta catalog in background...");
      data.cmd = cmd;
    }else{
       toast.success("Syncing Meta catalog in background...");
    }

    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in Syncing Menu Data')
    }
  }
}

export async function syncShopifyData(businessId: string): Promise<any> {
  try {
    // toast.success("Syncing Meta catalog in background...");
    const url = `products/${ENDPOINTS.syncShopifyData}/${businessId}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in Syncing Shopify Data')
    }
  }
}
