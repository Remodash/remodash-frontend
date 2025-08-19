//import { useState } from 'react';
import { XCircle, ChevronUp, ChevronDown} from 'lucide-react';
import { Tenant, FormData, ExpandedSections, Colors } from '../../types/edlTypes';
//import { rooms, roomStates } from '../../data/roomData';

interface TenantModalProps {
  selectedTenant: Tenant | null;
  isModalOpen: boolean;
  formData: FormData;
  expandedSections: ExpandedSections;
  closeModal: () => void;
  handleSave: () => void;
  toggleSection: (section: keyof ExpandedSections) => void;
  handleInputChange: (field: string, value: string | boolean) => void;
  colors: Colors;
}

export const TenantModal = ({ 
  selectedTenant, 
  isModalOpen, 
  expandedSections, 
  closeModal, 
  handleSave, 
  toggleSection, 
  colors
}: TenantModalProps) => {
  if (!isModalOpen || !selectedTenant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-200 truncate">
                État des Lieux Entrant
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 mt-1 truncate">{selectedTenant.name}</p>
            </div>
            <button 
              onClick={closeModal}
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Informations générales */}
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
            <div 
              className="flex justify-between items-center p-3 sm:p-4 cursor-pointer"
              onClick={() => toggleSection('general')}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-200">Informations générales</h3>
              {expandedSections.general ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {expandedSections.general && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Nom du locataire</label>
                    <input 
                      type="text" 
                      value={selectedTenant.name} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Adresse du logement</label>
                    <input 
                      type="text" 
                      value={selectedTenant.address} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Date d&apos;entrée</label>
                    <input 
                      type="text" 
                      value={selectedTenant.entryDate} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                    />
                  </div>
                  {selectedTenant.inspection && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Inspecteur</label>
                      <input 
                        type="text" 
                        value={selectedTenant.inspection.inspector} 
                        readOnly 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ... Autres sections du modal ... */}

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 rounded-b-xl">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button 
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors order-2 sm:order-1"
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className={`px-4 py-2 ${colors.primary.light} ${colors.primary.dark} text-white rounded-lg hover:opacity-90 transition-opacity order-1 sm:order-2`}
            >
              {selectedTenant.inspection ? 'Mettre à jour' : 'Enregistrer EDL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};