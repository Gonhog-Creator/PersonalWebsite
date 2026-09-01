export type DSOType = 'galaxy' | 'nebula' | 'star-cluster' | 'supernova' | 'other';

export type CatalogueType = 'messier' | 'ngc' | 'ic' | 'barnard' | 'sharpless' | 'other';

export interface DSOImage {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  type: DSOType;
  constellation: string;
  imageUrl: string;
  telescope: string;
  exposure: string;
  location: string;
  year: number;
  catalogues?: Array<{
    type: CatalogueType;
    number: number | string;
  }> | null;
  processing?: string;
  astrobinUrl?: string;
  integration?: Array<{
    filter: string;
    frames: number;
    subExposure: string;
    total: string;
  }>;
  palettes?: {
    sho?: string;
    hoo?: string;
    custom?: string;
    customLabel?: string;
    shoAstrobinUrl?: string;
    hooAstrobinUrl?: string;
    customAstrobinUrl?: string;
  };
}

export interface AstroPhoto {
  id: number;
  src: string;
  title: string;
  location: string;
  date: string;
  alt: string;
}
