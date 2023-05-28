/*
 * @Author: thunderchen
 * @Date: 2023-05-28 14:29:04
 * @LastEditTime: 2023-05-28 14:52:12
 * @email: 853524319@qq.com
 * @Description: 
 */

export interface CreateApprovalParams {
    approval_code: string;
    user_id: string;
    form: string;
  }
  
  export interface GetApprovalDefinedParams {
    approval_code: string;
  }
  
  export interface GetApprovalInstanceParams {
    instance_code: string;
    user_id?: string;
    open_id?: string;
  }