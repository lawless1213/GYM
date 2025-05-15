import { useState } from 'react';
import { useQuery } from "@apollo/client";
import { useExercises } from './useExercises.js';
import { GET_FILTERS } from '../queries/filters.js';
import { filterNames, groupNames } from '../services/exerciseService.js';
import { useAuth } from '../stores/context/AuthContext.jsx';

export const useExerciseCatalog = (initialGroup = groupNames.ALL) => {
  const { currentUser } = useAuth();
  const [groupExercise, setGroupExercise] = useState(initialGroup);
  const [filters, setFilters] = useState({});

  const { data: filterBodyPartsData, loading: loadingBodyParts } = useQuery(GET_FILTERS, { variables: { name: "bodyPart" } });
  const { data: filterEquipmentData, loading: loadingEquipment } = useQuery(GET_FILTERS, { variables: { name: "equipment" } });

  const { exercises, loading, error } = useExercises(groupExercise, filters, currentUser);

  const handleFilterChange = (name, values) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (!values.length) {
        delete updatedFilters[name];
      } else {
        updatedFilters[name] = values;
      }

      return updatedFilters;
    });
  };

  const filterOptions = {
    equipment: {
      data: filterEquipmentData?.getFilters.values || [],
      loading: loadingEquipment,
      name: filterNames.EQUIPMENT,
    },
    bodyPart: {
      data: filterBodyPartsData?.getFilters.values || [],
      loading: loadingBodyParts,
      name: filterNames.BODYPART,
    },
  };

  return {
    exercises,
    loading,
    error,
    groupExercise,
    setGroupExercise,
    filters,
    handleFilterChange,
    filterOptions,
    currentUser,
  };
};