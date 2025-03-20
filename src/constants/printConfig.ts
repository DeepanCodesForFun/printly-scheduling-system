
export const printConfigs = [
  {
    id: "color",
    title: "Color Mode",
    options: [
      { id: "bw", label: "Black & White", value: "bw" },
      { id: "color", label: "Color", value: "color" }
    ]
  },
  {
    id: "sides",
    title: "Print Sides",
    options: [
      { id: "single", label: "Single-sided", value: "single" },
      { id: "double", label: "Double-sided", value: "double" }
    ]
  },
  {
    id: "copies",
    title: "No of Copies",
    options: [
      { id: "1", label: "1 Copy", value: "1" },
      { id: "2", label: "2 Copies", value: "2" },
      { id: "3", label: "3 Copies", value: "3" },
      { id: "4", label: "4 Copies", value: "4" },
      { id: "5", label: "5 Copies", value: "5" },
      { id: "6", label: "6 Copies", value: "6" },
      { id: "7", label: "7 Copies", value: "7" },
      { id: "8", label: "8 Copies", value: "8" },
      { id: "9", label: "9 Copies", value: "9" },
      { id: "10", label: "10 Copies", value: "10" },
    ]
  }
];

export const STEPS = [
  { 
    number: 1, 
    title: "Upload Files", 
    icon: "Upload",
    description: "Upload the documents you want to print"
  },
  { 
    number: 2, 
    title: "Configure", 
    icon: "Sliders",
    description: "Set print options for your documents"
  },
  { 
    number: 3, 
    title: "Student Information", 
    icon: "Settings",
    description: "Enter your name and student ID"
  }
];
