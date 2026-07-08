import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    hcp_name: '',
    interaction_type: 'Meeting',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: ''
  },
  chatHistory: [
    { id: 1, sender: 'ai', text: 'Hello! You can log your field interactions naturally here. Try typing: "Met Dr. Smith today for a meeting, we discussed product updates, sentiment was positive, and I shared the primary brochure."' }
  ],
  isAiLoading: false
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    autoPopulateForm: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setAiLoading: (state, action) => {
      state.isAiLoading = action.payload;
    }
  }
});

export const { updateField, autoPopulateForm, addChatMessage, setAiLoading } = interactionSlice.actions;
export default interactionSlice.reducer;