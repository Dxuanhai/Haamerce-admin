"use client";

import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
  entityParamsName?: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityParamsName,
  entityIdName,
}) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      {entityParamsName && (
        <ApiAlert
          title="GET"
          variant="public"
          description={`${baseUrl}/${entityName}/{${entityIdName}}/{${
            entityParamsName && entityParamsName
          }}`}
        />
      )}
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}${
          entityParamsName ? `/{${entityParamsName}} ` : ""
        }`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}${
          entityParamsName ? `/{${entityParamsName}} ` : ""
        }`}
      />
    </>
  );
};
