
<template>
  <div class="w-full h-full">
    <div class="flex w-full p-4">
      <q-breadcrumbs>
        <q-breadcrumbs-el to="/" label="Home" icon="home" />
        <q-breadcrumbs-el label="Comments Managments" icon="school" />
      </q-breadcrumbs>
    </div>

    <q-table
      ref="myTable"
      :class="tableClass"
      tabindex="0"
      title="Treats"
      :data="getData"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="q-pa-md" style="max-width: 300px">
          <q-input borderless dense v-model="dateFrom" mask="date" placeholder="From">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-pa-md" style="max-width: 300px">
          <q-input borderless dense v-model="dateTo" mask="date" placeholder="To">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              round
              flat
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="flex flex-col">
              <h4>Comments</h4>
              <q-list class="h-32 overflow-auto w-1/3" v-if="props.row.comments">
                <q-item v-for=" comment in props.row.comments" :key="comment.id">
                  <q-item-section top avatar>
                    <q-avatar>
                      <img :src="comment.user.avatar_url" @error="getImage" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ comment.user.display_name }}</q-item-label>
                    <q-item-label caption>{{ comment.body }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="w-1/3">
                <q-input borderless dense placeholder="Reply">
                  <template v-slot:after>
                    <q-btn round dense flat icon="send" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- <div class="text-left">This is expand slot for row above: {{ props.row }}.</div> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { date } from "quasar";
export default {
  created() {
    this.getComments();
  },
  data() {
    return {
      navigationActive: false,
      filter: "",
      selected: [],
      pagination: {},
      dateFrom: "",
      dateTo: "",
      columns: [
        {
          name: "id",
          required: true,
          label: "id",
          align: "left",
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "time",
          align: "center",
          label: "Time",
          field: "time",
          format: (val) => date.formatDate(val, "YYYY/MM/DD hh:mm A"),
          sortable: true,
        },
        {
          name: "comment",
          label: "Comment",
          field: "comment",
          sortable: true,
        },
      ],
      data: [
        //     {
        //       id: 1,
        //       name: "Frozen Yogurt",
        //       calories: 159,
        //       fat: 6.0,
        //       carbs: 24,
        //       protein: 4.0,
        //       sodium: 87,
        //       calcium: "14%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 2,
        //       name: "Ice cream sandwich",
        //       calories: 237,
        //       fat: 9.0,
        //       carbs: 37,
        //       protein: 4.3,
        //       sodium: 129,
        //       calcium: "8%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 3,
        //       name: "Eclair",
        //       calories: 262,
        //       fat: 16.0,
        //       carbs: 23,
        //       protein: 6.0,
        //       sodium: 337,
        //       calcium: "6%",
        //       iron: "7%"
        //     },
        //     {
        //       id: 4,
        //       name: "Cupcake",
        //       calories: 305,
        //       fat: 3.7,
        //       carbs: 67,
        //       protein: 4.3,
        //       sodium: 413,
        //       calcium: "3%",
        //       iron: "8%"
        //     },
        //     {
        //       id: 5,
        //       name: "Gingerbread",
        //       calories: 356,
        //       fat: 16.0,
        //       carbs: 49,
        //       protein: 3.9,
        //       sodium: 327,
        //       calcium: "7%",
        //       iron: "16%"
        //     },
        //     {
        //       id: 6,
        //       name: "Jelly bean",
        //       calories: 375,
        //       fat: 0.0,
        //       carbs: 94,
        //       protein: 0.0,
        //       sodium: 50,
        //       calcium: "0%",
        //       iron: "0%"
        //     },
        //     {
        //       id: 7,
        //       name: "Lollipop",
        //       calories: 392,
        //       fat: 0.2,
        //       carbs: 98,
        //       protein: 0,
        //       sodium: 38,
        //       calcium: "0%",
        //       iron: "2%"
        //     },
        //     {
        //       id: 8,
        //       name: "Honeycomb",
        //       calories: 408,
        //       fat: 3.2,
        //       carbs: 87,
        //       protein: 6.5,
        //       sodium: 562,
        //       calcium: "0%",
        //       iron: "45%"
        //     },
        //     {
        //       id: 9,
        //       name: "Donut",
        //       calories: 452,
        //       fat: 25.0,
        //       carbs: 51,
        //       protein: 4.9,
        //       sodium: 326,
        //       calcium: "2%",
        //       iron: "22%"
        //     },
        //     {
        //       id: 10,
        //       name: "KitKat",
        //       calories: 518,
        //       fat: 26.0,
        //       carbs: 65,
        //       protein: 7,
        //       sodium: 54,
        //       calcium: "12%",
        //       iron: "6%"
        //     },
        //     {
        //       id: 11,
        //       name: "Frozen Yogurt-1",
        //       calories: 159,
        //       fat: 6.0,
        //       carbs: 24,
        //       protein: 4.0,
        //       sodium: 87,
        //       calcium: "14%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 12,
        //       name: "Ice cream sandwich-1",
        //       calories: 237,
        //       fat: 9.0,
        //       carbs: 37,
        //       protein: 4.3,
        //       sodium: 129,
        //       calcium: "8%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 13,
        //       name: "Eclair-1",
        //       calories: 262,
        //       fat: 16.0,
        //       carbs: 23,
        //       protein: 6.0,
        //       sodium: 337,
        //       calcium: "6%",
        //       iron: "7%"
        //     },
        //     {
        //       id: 14,
        //       name: "Cupcake-1",
        //       calories: 305,
        //       fat: 3.7,
        //       carbs: 67,
        //       protein: 4.3,
        //       sodium: 413,
        //       calcium: "3%",
        //       iron: "8%"
        //     },
        //     {
        //       id: 15,
        //       name: "Gingerbread-1",
        //       calories: 356,
        //       fat: 16.0,
        //       carbs: 49,
        //       protein: 3.9,
        //       sodium: 327,
        //       calcium: "7%",
        //       iron: "16%"
        //     },
        //     {
        //       id: 16,
        //       name: "Jelly bean-1",
        //       calories: 375,
        //       fat: 0.0,
        //       carbs: 94,
        //       protein: 0.0,
        //       sodium: 50,
        //       calcium: "0%",
        //       iron: "0%"
        //     },
        //     {
        //       id: 17,
        //       name: "Lollipop-1",
        //       calories: 392,
        //       fat: 0.2,
        //       carbs: 98,
        //       protein: 0,
        //       sodium: 38,
        //       calcium: "0%",
        //       iron: "2%"
        //     },
        //     {
        //       id: 18,
        //       name: "Honeycomb-1",
        //       calories: 408,
        //       fat: 3.2,
        //       carbs: 87,
        //       protein: 6.5,
        //       sodium: 562,
        //       calcium: "0%",
        //       iron: "45%"
        //     },
        //     {
        //       id: 19,
        //       name: "Donut-1",
        //       calories: 452,
        //       fat: 25.0,
        //       carbs: 51,
        //       protein: 4.9,
        //       sodium: 326,
        //       calcium: "2%",
        //       iron: "22%"
        //     },
        //     {
        //       id: 20,
        //       name: "KitKat-1",
        //       calories: 518,
        //       fat: 26.0,
        //       carbs: 65,
        //       protein: 7,
        //       sodium: 54,
        //       calcium: "12%",
        //       iron: "6%"
        //     },
        //     {
        //       id: 21,
        //       name: "Frozen Yogurt-2",
        //       calories: 159,
        //       fat: 6.0,
        //       carbs: 24,
        //       protein: 4.0,
        //       sodium: 87,
        //       calcium: "14%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 22,
        //       name: "Ice cream sandwich-2",
        //       calories: 237,
        //       fat: 9.0,
        //       carbs: 37,
        //       protein: 4.3,
        //       sodium: 129,
        //       calcium: "8%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 23,
        //       name: "Eclair-2",
        //       calories: 262,
        //       fat: 16.0,
        //       carbs: 23,
        //       protein: 6.0,
        //       sodium: 337,
        //       calcium: "6%",
        //       iron: "7%"
        //     },
        //     {
        //       id: 24,
        //       name: "Cupcake-2",
        //       calories: 305,
        //       fat: 3.7,
        //       carbs: 67,
        //       protein: 4.3,
        //       sodium: 413,
        //       calcium: "3%",
        //       iron: "8%"
        //     },
        //     {
        //       id: 25,
        //       name: "Gingerbread-2",
        //       calories: 356,
        //       fat: 16.0,
        //       carbs: 49,
        //       protein: 3.9,
        //       sodium: 327,
        //       calcium: "7%",
        //       iron: "16%"
        //     },
        //     {
        //       id: 26,
        //       name: "Jelly bean-2",
        //       calories: 375,
        //       fat: 0.0,
        //       carbs: 94,
        //       protein: 0.0,
        //       sodium: 50,
        //       calcium: "0%",
        //       iron: "0%"
        //     },
        //     {
        //       id: 27,
        //       name: "Lollipop-2",
        //       calories: 392,
        //       fat: 0.2,
        //       carbs: 98,
        //       protein: 0,
        //       sodium: 38,
        //       calcium: "0%",
        //       iron: "2%"
        //     },
        //     {
        //       id: 28,
        //       name: "Honeycomb-2",
        //       calories: 408,
        //       fat: 3.2,
        //       carbs: 87,
        //       protein: 6.5,
        //       sodium: 562,
        //       calcium: "0%",
        //       iron: "45%"
        //     },
        //     {
        //       id: 29,
        //       name: "Donut-2",
        //       calories: 452,
        //       fat: 25.0,
        //       carbs: 51,
        //       protein: 4.9,
        //       sodium: 326,
        //       calcium: "2%",
        //       iron: "22%"
        //     },
        //     {
        //       id: 30,
        //       name: "KitKat-2",
        //       calories: 518,
        //       fat: 26.0,
        //       carbs: 65,
        //       protein: 7,
        //       sodium: 54,
        //       calcium: "12%",
        //       iron: "6%"
        //     },
        //     {
        //       id: 31,
        //       name: "Frozen Yogurt-3",
        //       calories: 159,
        //       fat: 6.0,
        //       carbs: 24,
        //       protein: 4.0,
        //       sodium: 87,
        //       calcium: "14%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 32,
        //       name: "Ice cream sandwich-3",
        //       calories: 237,
        //       fat: 9.0,
        //       carbs: 37,
        //       protein: 4.3,
        //       sodium: 129,
        //       calcium: "8%",
        //       iron: "1%"
        //     },
        //     {
        //       id: 33,
        //       name: "Eclair-3",
        //       calories: 262,
        //       fat: 16.0,
        //       carbs: 23,
        //       protein: 6.0,
        //       sodium: 337,
        //       calcium: "6%",
        //       iron: "7%"
        //     },
        //     {
        //       id: 34,
        //       name: "Cupcake-3",
        //       calories: 305,
        //       fat: 3.7,
        //       carbs: 67,
        //       protein: 4.3,
        //       sodium: 413,
        //       calcium: "3%",
        //       iron: "8%"
        //     },
        //     {
        //       id: 35,
        //       name: "Gingerbread-3",
        //       calories: 356,
        //       fat: 16.0,
        //       carbs: 49,
        //       protein: 3.9,
        //       sodium: 327,
        //       calcium: "7%",
        //       iron: "16%"
        //     },
        //     {
        //       id: 36,
        //       name: "Jelly bean-3",
        //       calories: 375,
        //       fat: 0.0,
        //       carbs: 94,
        //       protein: 0.0,
        //       sodium: 50,
        //       calcium: "0%",
        //       iron: "0%"
        //     },
        //     {
        //       id: 37,
        //       name: "Lollipop-3",
        //       calories: 392,
        //       fat: 0.2,
        //       carbs: 98,
        //       protein: 0,
        //       sodium: 38,
        //       calcium: "0%",
        //       iron: "2%"
        //     },
        //     {
        //       id: 38,
        //       name: "Honeycomb-3",
        //       calories: 408,
        //       fat: 3.2,
        //       carbs: 87,
        //       protein: 6.5,
        //       sodium: 562,
        //       calcium: "0%",
        //       iron: "45%"
        //     },
        //     {
        //       id: 39,
        //       name: "Donut-3",
        //       calories: 452,
        //       fat: 25.0,
        //       carbs: 51,
        //       protein: 4.9,
        //       sodium: 326,
        //       calcium: "2%",
        //       iron: "22%"
        //     },
        //     {
        //       id: 40,
        //       name: "KitKat-3",
        //       calories: 518,
        //       fat: 26.0,
        //       carbs: 65,
        //       protein: 7,
        //       sodium: 54,
        //       calcium: "12%",
        //       iron: "6%"
        //     }
      ],
    };
  },

  computed: {
    ...mapGetters(["comments"]),
    getData() {
      for (let index = 0; index < this.comments.length; index++) {
        this.data.push({
          id: this.comments[index].id,
          time: this.comments[index].created_at,
          name: this.comments[index].user.display_name,
          comment: this.comments[index].body,
          comments: this.comments[index].comments,
          parent_lecture: this.comments[index].parent_lecture,
          content_info: this.comments[index].content_info,
        });
      }
      console.log("d", this.data);
      console.log("d", this.comments);
      return this.data;
    },
    tableClass() {
      return this.navigationActive === true ? "shadow-8 no-outline" : void 0;
    },
  },

  methods: {
    ...mapActions(["getComments"]),
    getImage(event) {
      event.target.src = require("../assets/img/abwaab-user-default.png");
    },
  },
};
</script>

<style>
</style>
