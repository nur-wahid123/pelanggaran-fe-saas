import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { SchoolObject } from "@/objects/school.object";
import ENDPOINT from "@/config/url";
import { Badge } from "@/components/ui/badge";
import { getImage } from "@/util/util";
import { useEffect, useState } from "react";

type SchoolCardProps = {
  school: SchoolObject;
  isLoading: boolean;
};

export default function SchoolCard({ school, isLoading }: SchoolCardProps) {
  const [imageId, setImageId] = useState(0);
  useEffect(() => {
    async function aa() {
      if (school.image) {
        const imgId = await getImage(school.image);
        setImageId(imgId);
      }
    }
    aa();
  }, [school]);
  return (
    <Card
      className="w-full shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-200"
      aria-disabled={isLoading}
      tabIndex={isLoading ? -1 : 0}
      style={isLoading ? { opacity: 0.6, pointerEvents: "none" } : {}}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full p-3 flex justify-center items-center">
          <img
            src={`${ENDPOINT.DETAIL_IMAGE}/${imageId}`}
            className="h-full"
          />
        </div>
        <div>
          <CardTitle className="text-lg md:text-xl font-bold text-blue-900 break-words">
            {school.name}
          </CardTitle>
          {school.description && (
            <CardDescription className="text-xs text-blue-500">
              Deskripsi: {school.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex flex-col gap-3 pt-0">
          {school.address && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-violet-500" />
              <span className="break-words">{school.address}</span>
            </div>
          )}
          {school.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="break-all">{school.email}</span>
            </div>
          )}
          {school.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-green-500" />
              <span>{school.phone}</span>
            </div>
          )}
        </div>
        <div>
          {school.is_active ? (
            <Badge
              variant={"secondary"}
              className="bg-blue-500 text-white dark:bg-blue-600"
            >
              Aktif
            </Badge>
          ) : (
            <Badge variant={"destructive"}>Tidak Aktif</Badge>
          )}
        </div>
        {/* You can add more fields here as needed */}
      </CardContent>
    </Card>
  );
}
