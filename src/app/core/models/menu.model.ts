export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  permission?: string;
  items?: MenuItem[];
  badge?: string;
}
