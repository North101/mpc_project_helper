import { UploadedImage } from "mpc_api";
import { Unit } from "./mpc";

export interface ProjectCard extends UploadedImage {
  id: number;
}

export interface Project {
  version: 1;
  code: string;
  cards: UploadedImage[];
}

export interface ParsedProject extends Project {
  id: string;
  name: string;
  unit: Unit;
  cards: ProjectCard[];
}
