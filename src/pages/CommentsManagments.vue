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
      :data="getData"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :filter="filter"
    >
      <template v-slot:top>
        <div class="flex justify-start w-1/5">
          <span class="text-xl">Comments</span>
        </div>
        <div class="flex justify-end w-4/5">
          <q-input
            class="w-1/5 mx-1"
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <div class="w-1/5 mx-1">
            <q-input
              borderless
              dense
              clearable
              readonly
              @input="filterfromto"
              v-model="filterDate"
              placeholder="Filter Range"
            >
              <template v-slot:append>
                <q-icon name="event" @click="clearDateFilter" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @range-end="SetDate($event)" range v-model="filterDatePicker">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="w-1/5 mx-1">
            <q-select
              borderless
              dense
              v-model="Countries"
              :options="websiteCountries"
              @input="filterByCountry"
              label="Countries"
            >
              <template v-slot:selected>
                <div v-if="Countries">
                  <q-avatar color="primary" size="15px" text-color="white">
                    <img :src="Countries.icon" />
                  </q-avatar>
                  {{ Countries.label }}
                </div>
                <div v-else></div>
              </template>
            </q-select>
          </div>
          <q-btn flat round color="primary" @click="search" icon="search" />
          <q-btn flat round color="primary" v-if="showClear" @click="clear" icon="clear" />
          <q-btn flat round color="primary" :disable="!data.length" @click="exportTable" icon="get_app" />
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
                <q-input v-model="replayText" borderless dense placeholder="Reply">
                  <template v-slot:after>
                    <q-btn @click="sendReply(props.row)" round dense flat icon="send" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="isFirstPage"
          @click="firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="isFirstPage"
          @click="prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="isLastPage"
          @click="nextPage"
        />

        <q-btn
          v-if="pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="isLastPage"
          @click="lastPage"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { date, LocalStorage, exportFile } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
export default {
  created() {
    this.getComments({
      limit: this.pagination.rowsPerPage,
      offset: 10,
    });
  },
  data() {
    return {
      navigationActive: false,
      filter: "",
      selected: [],
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      filterDate: "",
      filterDatePicker: { from: "2021/01/01", to: "" },
      replayText: "",
      startDate: "",
      endDate: "",
      showClear: false,
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
      data: [],
      reCoil: false,
      Countries: "",
      websiteCountries: [
        {
          id: 1,
          value: "JO",
          label: "Jordan",
          icon: require("../assets/flags/Jordan_flag.png"),
        },
        {
          id: 2,
          value: "PS",
          label: "Palestine",
          icon: require("../assets/flags/Palestine_flag.png"),
        },
        {
          id: 3,
          value: "EG",
          label: "Egypt",
          icon: require("../assets/flags/Egypt_flag.png"),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["comments", "posts"]),
    getData() {
      if (!this.reCoil) {
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
        return this.data;
      } else {
        return this.data;
      }
    },
    tableClass() {
      return this.navigationActive === true ? "shadow-8 no-outline" : void 0;
    },
    pagesNumber() {
      return Math.ceil(this.posts / this.pagination.rowsPerPage);
    },
    isFirstPage() {
      return this.pagination.page == 1 ? true : false;
    },
    isLastPage() {
      return this.pagination.page ==
        Math.ceil(this.posts / this.pagination.rowsPerPage)
        ? true
        : false;
    },
  },
  methods: {
    ...mapActions(["getComments", "replyComment"]),
    getImage(event) {
      event.target.src = require("../assets/img/abwaab-user-default.png");
    },
    sendReply(parentComment) {
      const userId = LocalStorage.getItem("X-Hasura-User-Id");
      let data = {
        body: this.replayText,
        parent_lecture: parentComment.parent_lecture,
        userId: userId,
        parent_comment: parentComment.id,
        content_info: parentComment.content_info,
      };
      this.replyComment(data);
      this.replayText = "";
      this.getComments();
      this.$forceUpdate();
    },
    SetDate(range) {
      let startDate = (this.startDate = new Date(
        `${range.from.year}-${range.from.month}-${range.from.day + 1}`
      ).toGMTString());
      let endDate = (this.endDate = new Date(
        `${range.to.year}-${range.to.month}-${range.to.day + 1}`
      ).toGMTString());
      this.filterfromto(startDate, endDate);
      this.filterDate = `From: ${range.from.day}/${range.from.month}/${range.from.year}, To: ${range.to.day}/${range.to.month}/${range.to.year}`;
    },
    clearDateFilter() {
      this.filterDatePicker = { from: "", to: "" };
      this.reCoil = false;
    },
    filterfromto(start, end) {
      this.showClear = true;
      return this.data.filter((item) => {
        let date = new Date(
          new Date(item.time.split("T")[0]).toGMTString()
        ).getTime();
        let startDate = new Date(start).getTime();
        let endDate = new Date(end).getTime();
        return date >= startDate && date <= endDate;
      });
    },
    filterByCountry() {
      this.showClear = true;
      const cont = this.Countries.value;
      return this.data.filter((item) => {
        let country = item.content_info.country;
        return country == cont;
      });
    },
    search() {
      if (this.Countries) {
        this.data = this.filterByCountry();
      }
      if (this.startDate != "" && this.endDate != "") {
        this.data = this.filterfromto(this.startDate, this.endDate);
      }
      this.reCoil = true;
      this.$forceUpdate();
    },
    clear() {
      this.showClear = false;
      this.clearDateFilter();
      this.Countries = "";
      this.filterDate = "";
    },
    exportTable() {
      if (!this.data.length) {
        this.$q.notify({
          message: "No Data Found",
          color: "negative",
          icon: "warning",
        });
        return;
      }
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile(
        `Comments-${new Date().getTime()}.csv`,
        content,
        "text/csv"
      );

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
    async nextPage() {
      this.pagination.page = this.pagination.page + 1;
      let offset = this.pagination.page * this.pagination.rowsPerPage;
      await this.getComments({
        limit: this.pagination.rowsPerPage,
        offset: offset,
      });
      this.reCoil = false;
      this.$forceUpdate();
    },
    async prevPage() {
      this.pagination.page = this.pagination.page - 1;
      let offset = this.pagination.page * this.pagination.rowsPerPage;
      await this.getComments({
        limit: this.pagination.rowsPerPage,
        offset: offset,
      });
      this.reCoil = false;
      this.$forceUpdate();
    },
    async lastPage() {
      await this.getComments({
        limit: this.pagination.rowsPerPage,
        offset: Math.ceil(this.posts / this.pagination.rowsPerPage),
      });
      this.reCoil = false;
      this.$forceUpdate();
    },
    async firstPage() {
      await this.getComments({
        limit: this.pagination.rowsPerPage,
        offset: 10,
      });
      this.reCoil = false;
      this.$forceUpdate();
    },
  },
};
</script>
