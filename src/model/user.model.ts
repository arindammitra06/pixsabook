export enum Role {
    Viewer,
    Editor,
    Admin
  }
export type AppUser= {
    UserSubscription: any;
    id: number;
    userType: Role;
    resetPasswordFlag: number;
    resetPasswordCode?: string;
    name: string;
    photo?: string;
    location?: string;
    thumbnailUrl?:string,
    active: number;
    email?: string;
    mobile?: string;
    
    created_by: number;
    updated_by: number;
    created_at: Date;
    created_at_processed?:string;
    updated_at: Date;
    updated_at_processed?:string;
    
}