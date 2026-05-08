/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: comparisontable
 * Interface for ComparisonTable
 */
export interface ComparisonTable {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  featureName?: string;
  /** @wixFieldType text */
  featureDescription?: string;
  /** @wixFieldType text */
  vibeCodeStudioCapability?: string;
  /** @wixFieldType text */
  standardWixCapability?: string;
  /** @wixFieldType text */
  vibeCodeStudioBenefit?: string;
  /** @wixFieldType text */
  standardWixLimitation?: string;
}


/**
 * Collection ID: pricingpackages
 * @catalog This collection is an eCommerce catalog
 * Interface for PricingPackages
 */
export interface PricingPackages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  packageType?: string;
}


/**
 * Collection ID: processsteps
 * Interface for ProcessSteps
 */
export interface ProcessSteps {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  stepTitle?: string;
  /** @wixFieldType text */
  stepDescription?: string;
  /** @wixFieldType number */
  stepOrder?: number;
  /** @wixFieldType text */
  stepSlug?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  stepImage?: string;
  /** @wixFieldType text */
  stepBenefit?: string;
}
