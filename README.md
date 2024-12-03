```markdown
# ER Diagram Tool

An interactive Entity-Relationship (ER) diagramming tool built with Svelte. This application allows users to create and manipulate entities, attributes, and relationships visually on a canvas, facilitating the design of database schemas.

## Features

- **Entities**
  - ✅ Create entities via the toolbar
  - ✅ Drag and reposition entities on the canvas
  - ✅ Select entities by clicking
  - ✅ Support for weak entities

- **Attributes**
  - ✅ Add attributes to selected entities
  - ✅ Drag and reposition attributes connected to entities
  - ✅ Support for primary, multivalued, and calculated attributes

- **Relationships**
  - ✅ Enter relationship mode to select two entities and create a relationship
  - ✅ Display relationships as lines connecting entities
  - ✅ Represent relationships with diamonds on the canvas
  - ✅ Adjust relationship multiplicity (`1-1`, `1-N`, `N-1`, `N-N`)
  - ✅ Relationships have editable names

- **Canvas Interactions**
  - ✅ Pan the canvas by dragging
  - ✅ Zoom in and out with the mouse wheel
  - ✅ Toggle grid display

- **Toolbar Actions**
  - ✅ Reset the view
  - ✅ Add new entities
  - ✅ Add new relationships
  - ✅ Toggle grid visibility
  - ✅ Toggle theme (light/dark mode)
  - ✅ Add attributes to selected entities

- **Other Features**
  - ❌ Deleting entities, attributes, or relationships
  - ❌ Editing names directly on the canvas
  - ❌ Saving and loading diagrams
  - ❌ Exporting diagrams to image or code formats
  - ❌ Undo and redo functionality
  - ❌ Error handling and validations
  - ❌ Multiple relationship types beyond binary
  - ❌ Multi-user collaboration

## Project Summary

This ER Diagram Tool is designed to help users create and visualize database schemas through an intuitive graphical interface. Users can:

- **Create Entities:** Add entities to the canvas and position them as needed.
- **Add Attributes:** Assign attributes to entities, supporting various attribute types.
- **Define Relationships:** Establish relationships between entities by entering relationship mode and selecting entities to connect.
- **Interact with the Canvas:** Navigate the canvas with pan and zoom features, and toggle a grid for alignment assistance.
- **Customize Appearance:** Switch between light and dark themes to suit your preferences.

The project's modular structure with Svelte components ensures maintainability and scalability, making it easy to extend functionality in the future.

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/halsschmerzen/svenja.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd svenja
   ```

3. **Install Dependencies**

   Make sure you have [Node.js](https://nodejs.org/en/) installed, then run:

   ```bash
   npm install
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Open the Application**

   Open your web browser and navigate to `http://localhost:5173` to use the ER Diagram Tool Svenja.

## Technologies Used

- **Svelte:** For building reactive user interfaces.
- **TypeScript:** Providing type safety and enhanced IDE support.
- **HTML5 Canvas:** Rendering the interactive canvas elements.
- **CSS:** Styling the application components.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to enhance the functionality of the ER Diagram Tool.

## License

This project is licensed under the MIT License.

```