import { useQuery } from "@tanstack/react-query"
import { getAllUsers } from "api/users"

export const useManageEmployees = () => {

    const { data: getAllUsersData, isLoading: getAllUsersLoading, refetch: refetchGetAllUsers } = useQuery({
        queryKey: ['getAllUsersData'],
        queryFn: getAllUsers,
    })

    return {
        getAllUsersData,
        getAllUsersLoading,
        refetchGetAllUsers,
    }
}