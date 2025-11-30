'use client'

import Room from "./Room"; 
import ProjectBoard from "./ProjectBoard"; 
import { useParams } from "next/navigation";

export default function LiveProjectPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Room id={id}>
       <ProjectBoard />
    </Room>
  );
}